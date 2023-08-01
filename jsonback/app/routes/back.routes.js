module.exports = app => {

  const jsonPlace = require("../controllers/jsonplaceholder.js");

  var router = require("express").Router();

  router.get("/:id", jsonPlace.findById);

  router.get("/", jsonPlace.filtered);

  app.use("/api/externalapi/photos", router);
};