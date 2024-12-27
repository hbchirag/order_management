const { Permission, Role, User } = require('../models');

// Create a new permission
exports.createPermission = async (req, res) => {
  const { role_id, action, description, status } = req.body;
  const createdBy = req.user.id;

  try {
    const newPermission = await Permission.create({
      role_id,
      action,
      description,
      status: status || 'Active',
      created_by: createdBy,
      updated_by: createdBy,
    });

    const createdPermission = await Permission.findByPk(newPermission.permission_id, {
      include: {
        model: Role,
        as: 'role',
        attributes: ['role_name'],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Permission created successfully.',
      data: createdPermission,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Permission creation failed.',
      error: error.message,
    });
  }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      include: {
        model: Role,
        as: 'role',
        attributes: ['role_name'],
      },
    });

    res.status(200).json({
      success: true,
      message: 'Permissions fetched successfully.',
      data: permissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permissions.',
      error: error.message,
    });
  }
};

// Get permission by ID
exports.getPermissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByPk(id, {
      include: {
        model: Role,
        as: 'role',
        attributes: ['role_name'],
      },
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Permission fetched successfully.',
      data: permission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permission.',
      error: error.message,
    });
  }
};

// Update permission by ID
exports.updatePermission = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedBy = req.user.id;

  try {
    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found.',
      });
    }

    await permission.update({ ...updates, updated_by: updatedBy });

    res.status(200).json({
      success: true,
      message: 'Permission updated successfully.',
      data: permission,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Permission update failed.',
      error: error.message,
    });
  }
};

// Delete permission by ID
exports.deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found.',
      });
    }

    await permission.destroy();

    res.status(200).json({
      success: true,
      message: 'Permission deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Permission deletion failed.',
      error: error.message,
    });
  }
};
