module.exports = app => {
  const cadastro = require("../controllers/cadastro.controllers.js");
  var router = require("express").Router();

  router.post("/cadastro", cadastro.create);
  router.put("/cadastro/:id", cadastro.update);
  router.delete("/cadastro/:id", cadastro.delete);
  router.get("/cadastro/:id", cadastro.findOne);
  router.get("/cadastro/list", cadastro.findAll);

  router.get('/test', (req, res) => {
    res.send('Test route is working');
  });

  app.use('/', router);
};