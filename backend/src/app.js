const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const forecast = require('./components/forecast/api');
const archive = require('./components/archive/api');

app.use(cors());
app.get('/', (req, res) => {
  res.status(200).send("Well done!");
});
app.use('/api/forecast', forecast);
app.use('/api/archive', archive);

app.listen(port, () => {
  console.log(`GreenSpirit server listening on port ${port}`);
});