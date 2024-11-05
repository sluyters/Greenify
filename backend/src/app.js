const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
require('./init-db')
const forecast = require('./components/forecast/api');
const actual = require('./components/actual/api');


app.use(cors());
app.get('/', (req, res) => {
  res.status(200).send("Well done!");
});
app.use('/api/forecast', forecast);
app.use('/api/actual', actual);

app.listen(port, () => {
  console.log(`GreenSpirit server listening on port ${port}`);
});