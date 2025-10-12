const sequelize = require('./index'); 

async function syncModels() {
  try {
    await sequelize.sync({ alter: true }); 
    console.log('Models synchronized successfully.');
  } catch (error) {
    console.error('Sync error:', error);
  } finally {
    await sequelize.close();
  }
}

syncModels();
