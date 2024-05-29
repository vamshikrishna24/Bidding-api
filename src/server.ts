import express from "express";

require("dotenv").config();

const app = express();
require("./startup/routes")(app);
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
