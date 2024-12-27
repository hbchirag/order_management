const { Permission, Role } = require('../models'); // Assuming models are defined properly.

const authorize = (action) => {
    console.log('RBAC Middleware Loaded');

    return async (req, res, next) => {
        try {
            const roleId = req.user.role_id;
            const permission = await Permission.findOne({
                where: {
                    role_id: roleId,
                    action: action,
                    status: 'Active',
                },
            });

            if (!permission) {
                return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    };
};

module.exports = authorize;
