const { UserMailbox } = require('../models');

// Get all IMAP configurations for the logged-in TM
exports.getAllIMAPConfigurations = async (req, res) => {
  try {
    const tmId = req.user.id; // Authenticated TM's ID
    const configurations = await UserMailbox.findAll({ where: { tm_id: tmId } });

    res.status(200).json({
      success: true,
      message: 'IMAP configurations fetched successfully.',
      data: configurations,
    });
  } catch (error) {
    console.error('Error fetching IMAP configurations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch IMAP configurations.',
      error: error.message,
    });
  }
};

// Get a specific IMAP configuration by ID
exports.getIMAPConfigurationById = async (req, res) => {
  try {
    const { id } = req.params;
    const tmId = req.user.id;
    const configuration = await UserMailbox.findOne({ where: { id, tm_id: tmId } });

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'IMAP configuration not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'IMAP configuration fetched successfully.',
      data: configuration,
    });
  } catch (error) {
    console.error('Error fetching IMAP configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch IMAP configuration.',
      error: error.message,
    });
  }
};

// Create a new IMAP configuration
exports.createIMAPConfiguration = async (req, res) => {
  try {
    const { email_address, sync_start_date, sync_status, synchronization_frequency, imap_host, imap_port, imap_encryption, password } = req.body;

    // Validate required fields
    if (!email_address || !imap_host || !imap_port || !imap_encryption || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }
    // Check if there's an existing active configuration
  const existingConfig = await UserMailbox.findOne({
    where: { tm_id: req.user.id, sync_status: 'Active' },
  });

  if (existingConfig) {
    return res.status(400).json({
      success: false,
      message: 'An active IMAP configuration already exists for this user.',
    });
  }

    const newConfiguration = await UserMailbox.create({
      tm_id: req.user.id, // Authenticated user ID
      email_address,
      sync_start_date,
      sync_status: sync_status || 'Active',
      synchronization_frequency,
      imap_host,
      imap_port,
      imap_encryption,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'IMAP configuration created successfully.',
      data: newConfiguration,
    });
  } catch (error) {
    console.error('Error creating IMAP configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create IMAP configuration.',
      error: error.message,
    });
  }
};


// Update an existing IMAP configuration
exports.updateIMAPConfiguration = async (req, res) => {
  try {
    const { id } = req.params; // ID of the IMAP configuration to update
    const {
      email_address,
      sync_start_date,
      sync_status,
      synchronization_frequency,
      imap_host,
      imap_port,
      imap_encryption,
      password,
    } = req.body;

    // Validate required fields
    if (!email_address || !imap_host || !imap_port || !imap_encryption || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    // Find the configuration
    const mailbox = await UserMailbox.findByPk(id);

    if (!mailbox) {
      return res.status(404).json({
        success: false,
        message: 'IMAP configuration not found.',
      });
    }

    // Update the configuration
    await mailbox.update({
      email_address,
      sync_start_date,
      sync_status,
      synchronization_frequency,
      imap_host,
      imap_port,
      imap_encryption,
      password,
    });

    res.status(200).json({
      success: true,
      message: 'IMAP configuration updated successfully.',
      data: mailbox,
    });
  } catch (error) {
    console.error('Error updating IMAP configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update IMAP configuration.',
      error: error.message,
    });
  }
};

// Delete an IMAP configuration by ID
exports.deleteIMAPConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const tmId = req.user.id;

    const configuration = await UserMailbox.findOne({ where: { id, tm_id: tmId } });

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'IMAP configuration not found.',
      });
    }

    await configuration.destroy();

    res.status(200).json({
      success: true,
      message: 'IMAP configuration deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting IMAP configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete IMAP configuration.',
      error: error.message,
    });
  }
};
