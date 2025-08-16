const jwt = require('jsonwebtoken');
const { Employee, } = require('../models')


const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.secret_key, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }

        const userId = decoded.id;
        try {
            const user = await Employee.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user;
            next();

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

module.exports = authenticateToken;
