const express = require("express");
const app = express();
const db = require("./db/models");
const EventRoutes = require("./routes/events")

// MIDDLEWARE
app.use(express.json());
app.use(EventRoutes);

const run = async () => {
    try {
      await db.sequelize.sync();
    //   await db.sequelize.sync({alter: true});
    //   await db.sequelize.sync({force: true});
      console.log("Connection to the database successful!");
    } catch (error) {
      console.error("Error connecting to the database: ", error);
    }
  
    await app.listen(8001, () => {
      console.log("The application is running on localhost:8001");
    });
};
  
run();