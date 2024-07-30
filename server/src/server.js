const { server } = require('./app');
const sequelize = require('./config/database');
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log('Database synced');
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync the database:', err);
});
