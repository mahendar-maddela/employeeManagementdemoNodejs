const { Client, Project } = require('../models');

const totalCount = async (req, res,next) => {
  try {
    const totalClients = await Client.count();
    const totalProjects = await Project.count();
    // const completedProjects = await 

    res.status(200).json({
      success: true,
      message: "Total clients and projects",
      data: {
        totalClients,
        totalProjects
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { totalCount };
