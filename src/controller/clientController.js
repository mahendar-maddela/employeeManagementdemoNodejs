const { Client, Project, Employee, sequelize } = require("../models");

const createClient = async (req, res, next) => {
  try {
    //const empId = req.Employee.id;
    const newClient = await Client.create({
      name: req.body.name,
      number: req.body.number,
      email: req.body.email,
      note: req.body.note,
      company_Name: req.body.company_Name,
    });
    res.status(201).json({
      success: true,
      message: "client created successfully",
      data: newClient,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllClients = async (req, res, next) => {
  try {
    const { pageNo, pageSize } = req.query;

    let clients;
    if (pageNo && pageSize) {
      const page = parseInt(pageNo, 10);
      const limit = parseInt(pageSize, 10);
      const offset = (page - 1) * limit;

      clients = await Client.findAll({
        include: [{ model: Project, as: "projects" }],
        offset,
        limit,
        // order: [["id", "desc"]],
      });

      const clientIds = clients.map((client) => client.id);
      const projectCounts = await sequelize.query(
        `
        SELECT \`clientId\`, COUNT(*) AS projectCount
        FROM \`Projects\`
        WHERE \`clientId\` IN (:clientIds)
        GROUP BY \`clientId\``,
        {
          replacements: { clientIds },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const projectCountMap = Object.fromEntries(
        projectCounts.map(({ clientId, projectCount }) => [
          clientId,
          projectCount,
        ])
      );

      const clientsWithProjectCounts = clients.map((client) => ({
        ...client.toJSON(),
        projectCount: projectCountMap[client.id] || 0,
      }));

      const totalPages = Math.ceil(clients.length / limit);

      res.status(200).json({
        success: true,
        message: "All client data",
        data: clientsWithProjectCounts,
        totalPages,
      });
    } else {
      clients = await Client.findAll({
        include: [{ model: Project, as: "projects" }],
      });
      res.status(200).json({
        success: true,
        message: "All client data",
        data: clients,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const clientID = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: "projects",
          include: [{ model: Employee, as: "employees" }],
        },
      ],
    });
    if (client) {
      res.status(200).json({
        success: true,
        msg: "client view by id",
        data: client,
      });
    } else {
      res.status(404).json({ success: false, msg: "not found client details" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

const clientUpdate = async (req, res, next) => {
  try {
    // const empId = req.Employee.id;
    const client = await Client.findOne(req.body, {
      where: { id: req.params.id },
    });

    if (client) {
      const clientUpdate = Client.update(req.body, {
        where: { id: req.params.id },
      });
      return res.status(200).json({
        success: true,
        message: "client updated successfully",
        data: clientUpdate,
      });
    } else {
      res.status(404).json({ success: false, message: "client  not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      where: { id: req.params.id },
    });
    if (client) {
      await Client.destroy({
        where: { id: req.params.id },
      });
      return res
        .status(200)
        .json({ success: true, message: "client deleted successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "requested client not found" });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createClient,
  getAllClients,
  clientID,
  clientUpdate,
  deleteClient,
};
