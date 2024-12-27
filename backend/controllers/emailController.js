const { Email, Order, OrderStatusLog, ActivityLog, EmailAttachment } = require('../models');
const sequelize = require('../models').sequelize;

// Define status transition rules
const STATUS_TRANSITIONS = {
  Fetched: ['Pending Review', 'Filtered Out'],
  'Pending Review': ['Filtered Out', 'Confirmed Order Email'],
  'Filtered Out': [], // Terminal state
  'Confirmed Order Email': ['Order Email'],
  'Order Email': [], // Terminal state
};

class EmailController {
  /**
   * List all emails with filtering, sorting, and pagination
   */
  static async listEmails(req, res) {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 10 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.received_at = {};
      if (startDate) where.received_at.$gte = new Date(startDate);
      if (endDate) where.received_at.$lte = new Date(endDate);
    }
    if (search) {
      where.$or = [
        { subject: { [sequelize.Op.like]: `%${search}%` } },
        { sender: { [sequelize.Op.like]: `%${search}%` } },
        { content: { [sequelize.Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const emails = await Email.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit, 10),
      order: [['received_at', 'DESC']],
      include: [
        {
          model: EmailAttachment,
          as: 'attachments',
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: emails.rows,
      total: emails.count,
    });
  } catch (error) {
    console.error('Error listing emails:', error);
    return res.status(500).json({ success: false, message: 'Error listing emails' });
  }
}


  /**
   * View email details
   */
  static async viewEmail(req, res) {
    try {
      const { id } = req.params;

      const email = await Email.findByPk(id, {
        include: [{ model: EmailAttachment, as: 'attachments' }],
      });

      if (!email) {
        return res.status(404).json({ success: false, message: 'Email not found' });
      }

      return res.status(200).json({ success: true, data: email });
    } catch (error) {
      console.error('Error viewing email:', error);
      return res.status(500).json({ success: false, message: 'Error viewing email' });
    }
  }

  /**
   * Reclassify email status
   */
  static async reclassifyEmail(req, res) {
    try {
      const { id } = req.params;
      const { newStatus, comments } = req.body;

      const email = await Email.findByPk(id);
      if (!email) {
        return res.status(404).json({ success: false, message: 'Email not found' });
      }

      const previousStatus = email.status;

      // Validate status transition
      const allowedTransitions = STATUS_TRANSITIONS[previousStatus];
      if (!allowedTransitions.includes(newStatus)) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition from "${previousStatus}" to "${newStatus}".`,
        });
      }

      let order = null;

      if (newStatus === 'Order Email') {
        // Check if an order is already linked to the email
        const existingOrder = await Order.findOne({
          where: { email_id: email.id },
        });

        if (existingOrder) {
          return res.status(400).json({
            success: false,
            message: 'Email is already linked to an order.',
          });
        }

        // Create a new order
        order = await Order.create({
          email_id: email.id,
          customer_id: null, // Modify as needed
          job_owner_id: req.user.id, // Current user as job owner
          status: 'Unprocessed',
          created_by: req.user.id, // Track who created the order
        });
      }

      // Update the email's status
      email.status = newStatus;
      await email.save();

      // Log activity and order status
      await sequelize.transaction(async (transaction) => {
        await ActivityLog.create(
          {
            email_id: email.id,
            status: newStatus,
            previous_status: previousStatus,
            action: `Reclassified to ${newStatus}`,
            action_date: new Date(),
            user_id: req.user.id,
            comments,
          },
          { transaction }
        );

        if (order) {
          await OrderStatusLog.create(
            {
              order_id: order.id,
              previous_status: null,
              status: 'Unprocessed',
              status_date: new Date(),
              changed_by: req.user.id,
              comments: 'Order created from email reclassification.',
            },
            { transaction }
          );
        }
      });

      return res.status(200).json({
        success: true,
        message: `Email reclassified to "${newStatus}" successfully.`,
        data: { email, order },
      });
    } catch (error) {
      console.error('Error reclassifying email:', error);
      return res.status(500).json({
        success: false,
        message: 'Error reclassifying email',
        error: error.message,
      });
    }
  }

  /**
   * Delete an email
   */
  static async deleteEmail(req, res) {
    try {
      const { id } = req.params;

      const email = await Email.findByPk(id);
      if (!email) {
        return res.status(404).json({ success: false, message: 'Email not found' });
      }

      await email.destroy();
      return res.status(200).json({ success: true, message: 'Email deleted successfully' });
    } catch (error) {
      console.error('Error deleting email:', error);
      return res.status(500).json({ success: false, message: 'Error deleting email' });
    }
  }

  /**
   * Sync emails manually
   */
  static async syncEmails(req, res) {
    try {
      return res.status(200).json({ success: true, message: 'Email sync initiated.' });
    } catch (error) {
      console.error('Error syncing emails:', error);
      return res.status(500).json({ success: false, message: 'Error syncing emails' });
    }
  }
}

module.exports = EmailController;
