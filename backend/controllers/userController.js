const { User, Role } = require('../models');
const { hashPassword, comparePassword } = require('../utils/hashPassword');


exports.createUser = async (req, res) => {
  const { first_name, last_name, email, password, role_id, phone_number, department, profile_image, status } = req.body;
  const createdBy = req.user.id; // Assuming authMiddleware adds this

  if (!first_name || !last_name || !email || !password || !role_id) {
    return res.status(400).json({
      success: false,
      message: 'Required fields are missing.',
    });
  }

  try {
    const hashedPassword = await hashPassword(password);

    // Create the user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_id,
      phone_number,
      department,
      profile_image,
      status: status || 'Active',
      created_by: createdBy,
      updated_by: createdBy,
    });

    // Fetch the complete user data
    const createdUser = await User.findByPk(newUser.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['role_name'],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['first_name', 'last_name'],
        },
        {
          model: User,
          as: 'updatedBy',
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: createdUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'User creation failed.',
      error: error.message,
    });
  }
};





exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclude sensitive information
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['role_name'], // Include role details
        },
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
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully.',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      error: error.message,
    });
  }
};




exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }, // Exclude sensitive information
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['role_name'], // Include role details
        },
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
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully.',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user.',
      error: error.message,
    });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedBy = req.user.id;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    await user.update({ ...updates, updated_by: updatedBy });

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'User update failed.',
      error: error.message,
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'User deletion failed.',
      error: error.message,
    });
  }
};
