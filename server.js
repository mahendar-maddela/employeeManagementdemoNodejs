const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./src/models');
const allRoutes = require('./src/routes/index')


const app = express();

app.use(express.json());


app.use('/api/v1',allRoutes );

app.listen(8080, async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');
    console.log('Server is running on port 8080');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
});
