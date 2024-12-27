const { Order, Customer, User, OrderJob, OrderStatusLog, OrderAttachment, Email } = require('../models');
const sequelize = require('../models').sequelize;
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { xml2js, js2xml } = require('xml-js'); // Install xml-js for XML generation


class OrderController {
  // Order Listing
  static async listOrders(req, res) {
    try {
      const { status, search, startDate, endDate, sortBy = 'created_at', order = 'DESC', page = 1, limit = 10 } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (startDate || endDate) {
        filters.created_at = {};
        if (startDate) filters.created_at.$gte = new Date(startDate);
        if (endDate) filters.created_at.$lte = new Date(endDate);
      }
      if (search) {
        filters.$or = [
          { '$customer.name$': { $like: `%${search}%` } },
          { customer_order_ref: { $like: `%${search}%` } },
        ];
      }

      const offset = (page - 1) * limit;

      const orders = await Order.findAndCountAll({
        where: filters,
        include: [
          { model: Customer, as: 'customer', attributes: ['name', 'email'] },
          { model: User, as: 'owner', attributes: ['first_name', 'last_name'] },
        ],
        order: [[sortBy, order]],
        offset,
        limit: parseInt(limit),
      });

      res.status(200).json({
        success: true,
        data: orders.rows,
        total: orders.count,
      });
    } catch (error) {
      console.error('Error listing orders:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
  }

 // View Order Details
static async viewOrder(req, res) {
  try {
    const { id } = req.params;

    // Fetch the order with all associated details
    const order = await Order.findByPk(id, {
      include: [
        { model: Customer, as: 'customer' }, // Customer details
        { model: User, as: 'owner' }, // Job owner details
        { model: OrderJob, as: 'jobs' }, // Associated jobs
        {
          model: OrderAttachment,
          as: 'attachments', // Attachments related to the order
          attributes: ['id', 'file_path', 'file_type', 'file_size', 'uploaded_at'],
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'first_name', 'last_name'], // Uploaded by
            },
          ],
        },
        {
          model: OrderStatusLog,
          as: 'statusLogs', // Status logs for the order
          attributes: ['id', 'previous_status', 'status', 'status_date', 'comments'],
          include: [
            {
              model: User,
              as: 'changer',
              attributes: ['id', 'first_name', 'last_name'], // User who changed the status
            },
          ],
        },
        {
          model: Email,
          as: 'email', // Emails relevant to the order
          attributes: ['id', 'subject', 'sender', 'to', 'cc' , 'content', 'received_at'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Format the response to include extracted fields count
    const extractedFieldsCount = order.extractedFields?.length || 0; // Example calculation
    const totalExpectedFields = 10; // Replace with actual logic if dynamic
    const extractedFieldsStatus = extractedFieldsCount === totalExpectedFields
      ? 'green'
      : extractedFieldsCount >= Math.floor(totalExpectedFields * 0.7)
      ? 'orange'
      : 'red';

    // Construct the response object
    // Construct the response object
    const response = {
      id: order.id,
      customer: order.customer,
      owner: order.owner,
      jobs: order.jobs,
      attachments: order.attachments,
      emails: order.email, // Single email associated with the order
      statusLogs: order.statusLogs,
      status: order.status,
      currency: order.currency,
      total_jobs: order.total_jobs,
      xml_generated: order.xml_generated,
      xml_backup_path: order.xml_backup_path,
      customer_order_ref: order.customer_order_ref,
      tms_order_id: order.tms_order_id,
      created_by: order.created_by,
      updated_by: order.updated_by,
      extractedFields: {
        count: extractedFieldsCount,
        total: totalExpectedFields,
        status: extractedFieldsStatus,
      },
      created_at: order.created_at,
      updated_at: order.updated_at,
    };


    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details.' });
  }
}



  // Cancel an Order
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const { comments } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.status === 'Cancelled') {
        return res.status(400).json({ success: false, message: 'Order is already cancelled.' });
      }

      if (!['Unprocessed', 'Missing Info', 'Ready for Review', 'Error Received'].includes(order.status)) {
        return res.status(400).json({ success: false, message: 'Cannot cancel order in its current status.' });
      }

      await sequelize.transaction(async (transaction) => {
        await order.update({ status: 'Cancelled' }, { transaction });

        await OrderStatusLog.create(
          {
            order_id: id,
            previous_status: order.status,
            status: 'Cancelled',
            changed_by: req.user.id,
            comments,
          },
          { transaction }
        );
      });

      res.status(200).json({ success: true, message: 'Order cancelled successfully.' });
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel order.' });
    }
  }

  // Verify an Order
static async verifyOrder(req, res) {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderJob, as: 'jobs' }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'Ready for Review') {
      return res.status(400).json({ success: false, message: 'Order must be in "Ready for Review" status to verify.' });
    }

    // Check mandatory fields
    const mandatoryFields = ['customer_id', 'customer_order_ref', 'currency'];
    const missingFields = mandatoryFields.filter((field) => !order[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot verify order. Missing mandatory fields: ${missingFields.join(', ')}`,
      });
    }

    // Generate XML
    const xmlData = {
      Order: {
        OrderId: order.id,
        CustomerId: order.customer_id,
        CustomerRef: order.customer_order_ref,
        Currency: order.currency,
        Jobs: {
          Job: order.jobs.map((job) => ({
            Sequence: job.sequence_number,
            TaskDescription: job.task_description,
            Address: job.address,
            TimeIsFixed: job.time_is_fixed,
            SpecificDate: job.specific_date,
            StartTime: job.start_time,
            EndTime: job.end_time,
            DateRangeStart: job.date_range_start,
            DateRangeEnd: job.date_range_end
          }))
        }
      }
    };

    const xml = js2xml(xmlData, { compact: true, spaces: 2 });

    // Save XML to file
    const xmlDir = path.join(__dirname, '../uploads/xml');
    if (!fs.existsSync(xmlDir)) {
      fs.mkdirSync(xmlDir, { recursive: true });
    }
    const xmlFilePath = path.join(xmlDir, `order_${order.id}.xml`);
    fs.writeFileSync(xmlFilePath, xml);

    // Update order and log the status change
    await sequelize.transaction(async (transaction) => {
      await order.update({ status: 'Verified', xml_generated: true, xml_backup_path: xmlFilePath }, { transaction });

      await OrderStatusLog.create(
        {
          order_id: id,
          previous_status: order.status,
          status: 'Verified',
          changed_by: req.user.id,
        },
        { transaction }
      );
    });

    res.status(200).json({
      success: true,
      message: 'Order verified successfully.',
      data: {
        order_id: order.id,
        status: 'Verified',
        xml_generated: true,
        xml_backup_path: xmlFilePath,
      },
    });
  } catch (error) {
    console.error('Error verifying order:', error);
    res.status(500).json({ success: false, message: 'Failed to verify order.' });
  }
}

 // Update Order Details
static async updateOrder(req, res) {
    try {
        const { id } = req.params;
        const { customer_id, customer_order_ref, currency, status, jobs } = req.body;

        const order = await Order.findByPk(id, {
            include: [{ model: OrderJob, as: 'jobs' }]
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update order details
        order.customer_id = customer_id;
        order.customer_order_ref = customer_order_ref;
        order.currency = currency;
        order.status = status;
        order.updated_by = req.user.id;

        await order.save();

        const { Op } = require('sequelize');
        const processedJobIds = [];

        // Update or create OrderJobs
        if (jobs && Array.isArray(jobs)) {
            await Promise.all(
                jobs.map(async (job) => {
                    if (job.id) {
                        // Update existing job
                        const [updated] = await OrderJob.update(job, { where: { id: job.id, order_id: id } });
                        if (updated) processedJobIds.push(job.id);
                    } else {
                        // Create new job
                        const newJob = await OrderJob.create({
                            ...job,
                            order_id: id,
                            created_by: req.user.id
                        });
                        processedJobIds.push(newJob.id);
                    }
                })
            );
        }

        // Remove jobs not included in the update
        await OrderJob.destroy({
            where: {
                order_id: id,
                id: { [Op.notIn]: processedJobIds }
            }
        });

        // Re-fetch updated data for the response
        const updatedOrder = await Order.findByPk(id, {
            include: [
                { model: Customer, as: 'customer' },
                { model: User, as: 'owner' },
                { model: OrderJob, as: 'jobs' }
            ]
        });

        const totalJobs = updatedOrder.jobs.length;

        return res.status(200).json({
            success: true,
            message: 'Order updated successfully.',
            data: {
                order_id: updatedOrder.id,
                customer: updatedOrder.customer
                    ? { id: updatedOrder.customer.id, name: updatedOrder.customer.name, email: updatedOrder.customer.email }
                    : null,
                job_owner: updatedOrder.owner
                    ? { id: updatedOrder.owner.id, name: `${updatedOrder.owner.first_name} ${updatedOrder.owner.last_name}` }
                    : null,
                status: updatedOrder.status,
                currency: updatedOrder.currency,
                total_jobs: totalJobs,
                jobs: updatedOrder.jobs,
                xml_status: {
                    generated: updatedOrder.xml_generated,
                    backup_path: updatedOrder.xml_backup_path
                },
                reference: {
                    customer_order: updatedOrder.customer_order_ref,
                    tms_order: updatedOrder.tms_order_id
                },
                timestamps: {
                    created_at: updatedOrder.created_at,
                    updated_at: updatedOrder.updated_at
                }
            }
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ success: false, message: 'Failed to update order.' });
    }
}



  // Add a New Job to an Order
  static async addJob(req, res) {
    try {
      const { id } = req.params;
      const jobDetails = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const job = await OrderJob.create({
        ...jobDetails,
        order_id: id,
        created_by: req.user.id,
      });

      res.status(201).json({ success: true, message: 'Job added successfully.', data: job });
    } catch (error) {
      console.error('Error adding job:', error);
      res.status(500).json({ success: false, message: 'Failed to add job to order.' });
    }
  }
}

module.exports = OrderController;
