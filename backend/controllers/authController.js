const { User, Role, Permission, TokenBlacklist } = require('../models');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateJWT = require('../utils/generateJWT');


exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'role_id',
        'status',
        'phone_number',
        'department',
        'profile_image',
        'created_at',
        'updated_at',
        'password', // Required for comparison, excluded in the response
      ],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['role_name'], // Role details
          include: {
            model: Permission,
            as: 'permissions',
            attributes: ['action', 'description', 'status'], // Permissions for the role
          },
        },
        {
          model: User,
          as: 'createdBy', // User who created this user
          attributes: ['first_name', 'last_name'],
        },
        {
          model: User,
          as: 'updatedBy', // User who last updated this user
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive or suspended.',
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const token = generateJWT(user);

    // Construct the response data
    const responseData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role ? user.role.role_name : null,
      permissions: user.role ? user.role.permissions : [],
      phone_number: user.phone_number,
      department: user.department,
      profile_image: user.profile_image,
      created_at: user.created_at,
      updated_at: user.updated_at,
      created_by: user.createdBy ? `${user.createdBy.first_name} ${user.createdBy.last_name}` : null,
      updated_by: user.updatedBy ? `${user.updatedBy.first_name} ${user.updatedBy.last_name}` : null,
      token,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: responseData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};



exports.resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Both old and new passwords are required.',
    });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isMatch = await comparePassword(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect.',
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await user.update({ password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required." });
    }

    await TokenBlacklist.create({ token });

    res.status(200).json({
      success: true,
      message: "Logout successful. Token invalidated.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed.",
      error: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'role_id',
        'status',
        'phone_number',
        'department',
        'profile_image',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['role_name'],
          include: {
            model: Permission,
            as: 'permissions',
            attributes: ['action', 'description', 'status'],
          },
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User data fetched successfully.',
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role ? user.role.role_name : null,
        permissions: user.role ? user.role.permissions : [],
        phone_number: user.phone_number,
        department: user.department,
        profile_image: user.profile_image,
        created_at: user.created_at,
        updated_at: user.updated_at,
        created_by: user.createdBy
          ? `${user.createdBy.first_name} ${user.createdBy.last_name}`
          : null,
        updated_by: user.updatedBy
          ? `${user.updatedBy.first_name} ${user.updatedBy.last_name}`
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching current user data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

