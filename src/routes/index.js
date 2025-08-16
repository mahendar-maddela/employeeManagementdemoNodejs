const Router = require("express");
const employeeRoutes = require("../routes/employeeRoutes");
const taskRoutes = require('../routes/taskRoutes')
const taskTypeRoutes = require('../routes/taskTypeRoutes')
const projectRoutes = require('../routes/projectRoutes');
const projectTypeRoutes = require('../routes/projectTypeRouts');
const clientsRoutes = require('../routes/clientsRouts');
const authRouters = require('../routes/authRouts')
const bankRoutes = require('../routes/bankRoutes')
const permissionRoutes = require('../routes/permssionRoutes')
const roleRoutes = require('../routes/roleRoutes');
const dashboardRoutes = require('../routes/dashboardRouts')
const routers = Router();

routers.use('/auth', authRouters);
routers.use('/employee', employeeRoutes);
routers.use('/task', taskRoutes);
routers.use('/task-type', taskTypeRoutes);
routers.use('/client', clientsRoutes);
routers.use('/project', projectRoutes)
routers.use('/project-type', projectTypeRoutes);
routers.use('/bank', bankRoutes)
routers.use('/permission', permissionRoutes)
routers.use('/role', roleRoutes);
routers.use('/dashboard',  dashboardRoutes);


module.exports = routers;