const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.json());
require('./app/routes/cadastro.routes')(app);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
