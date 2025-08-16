const { Employee, Role, Permission } = require('../models')

const authorize = (permission) => {
    return async (req, res, next) => {
        try {
            const employee = await Employee.findByPk(req.user.id, {
                include: [
                    {
                        model: Role,
                        include: [{ model: Permission }]
                    }
                ]
            });

            const perm = employee.Roles.map((role) => role.Permissions)
                .flatMap((ele) => ele)
                .map((ele) => {
                    return { id: ele.id, name: ele.name };
                });

            const exists = perm.find((ele) => ele.name === permission);

            if (exists) {
                next();
            } else {
                res.status(403).json({ success: false, message: "Unauthorized" });
            }

        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }
}

module.exports = { authorize }