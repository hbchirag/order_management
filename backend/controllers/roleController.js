const { Role, User, Permission} = require('../models');

// Create a new role
exports.createRole = async (req, res) => {
  const { role_name, description, status } = req.body;
  const createdBy = req.user.id; // Auth middleware adds this

  try {
    const newRole = await Role.create({
      role_name,
      description,
      status: status || 'Active',
      created_by: createdBy,
      updated_by: createdBy,
    });

    const createdRole = await Role.findByPk(newRole.role_id, {
      include: {
        model: User,
        as: 'createdBy',
        attributes: ['first_name', 'last_name'],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully.',
      data: createdRole,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Role creation failed.',
      error: error.message,
    });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['first_name', 'last_name'], // Include creator details
        },
        {
          model: User,
          as: 'updatedBy',
          attributes: ['first_name', 'last_name'], // Include updater details
        },
        {
          model: Permission,
          as: 'permissions',
          attributes: ['action', 'description', 'status'], // Include permission details
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Roles fetched successfully.',
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles.',
      error: error.message,
    });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, {
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['first_name', 'last_name'], // Include creator details
        },
        {
          model: User,
          as: 'updatedBy',
          attributes: ['first_name', 'last_name'], // Include updater details
        },
        {
          model: Permission,
          as: 'permissions',
          attributes: ['action', 'description', 'status'], // Include permission details
        },
      ],
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role fetched successfully.',
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role.',
      error: error.message,
    });
  }
};


// Update role by ID
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedBy = req.user.id;

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    await role.update({ ...updates, updated_by: updatedBy });

    res.status(200).json({
      success: true,
      message: 'Role updated successfully.',
      data: role,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Role update failed.',
      error: error.message,
    });
  }
};

// Delete role by ID
exports.deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    await role.destroy();

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Role deletion failed.',
      error: error.message,
    });
  }
};

// Add permissions to a role
exports.addPermissionsToRole = async (req, res) => {
  const { id } = req.params; // Role ID
  const { permissions } = req.body; // List of permission IDs

  if (!permissions || !Array.isArray(permissions)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid permissions payload. Provide an array of permission IDs.',
    });
  }

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    const existingPermissions = await Permission.findAll({
      where: {
        role_id: id,
      },
      attributes: ['permission_id'],
    });

    const existingPermissionIds = existingPermissions.map((p) => p.permission_id);

    // Filter out permissions that already exist
    const newPermissions = permissions.filter((p) => !existingPermissionIds.includes(p));

    if (newPermissions.length > 0) {
      await Promise.all(
        newPermissions.map((permission_id) =>
          Permission.create({ role_id: id, permission_id, status: 'Active' })
        )
      );
    }

    res.status(200).json({
      success: true,
      message: 'Permissions added to role successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add permissions to role.',
      error: error.message,
    });
  }
};

// Remove permissions from a role
exports.removePermissionsFromRole = async (req, res) => {
  const { id } = req.params; // Role ID
  const { permissions } = req.body; // List of permission IDs

  if (!permissions || !Array.isArray(permissions)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid permissions payload. Provide an array of permission IDs.',
    });
  }

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    // Remove permissions
    await Permission.destroy({
      where: {
        role_id: id,
        permission_id: permissions,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Permissions removed from role successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove permissions from role.',
      error: error.message,
    });
  }
};

exports.createRoleWithExistingPermissions = async (req, res) => {
  const { role_name, description, status, permission_ids } = req.body;
  const createdBy = req.user.id; // Assuming authMiddleware adds this

  if (!role_name || !Array.isArray(permission_ids)) {
    return res.status(400).json({
      success: false,
      message: 'Role name and permission IDs are required.',
    });
  }

  try {
    // Create the new role
    const newRole = await Role.create({
      role_name,
      description,
      status: status || 'Active',
      created_by: createdBy,
      updated_by: createdBy,
    });

    // Associate existing permissions with the new role
    const existingPermissions = await Permission.findAll({
      where: { permission_id: permission_ids },
    });

    if (existingPermissions.length !== permission_ids.length) {
      return res.status(400).json({
        success: false,
        message: 'Some of the provided permission IDs do not exist.',
      });
    }

    await Promise.all(
      existingPermissions.map((permission) =>
        permission.update({ role_id: newRole.role_id })
      )
    );

    // Fetch the new role with its permissions
    const roleWithPermissions = await Role.findByPk(newRole.role_id, {
      include: {
        model: Permission,
        as: 'permissions',
        attributes: ['permission_id', 'action', 'description', 'status'],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully with permissions.',
      data: roleWithPermissions,
    });
  } catch (error) {
    console.error('Error creating role with existing permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role with permissions.',
      error: error.message,
    });
  }
};
