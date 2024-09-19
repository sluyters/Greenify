const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const ENERGY_DATA = require('./data');

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send("Well done!");
});

app.get('/api/forecast', (req, res) => {
  res.status(200).json(ENERGY_DATA.slice(0, 7));
});

// TODO
app.post('/api/forecast', (req, res) => {
  // TODO
  res.status(200).json(req.body);
});

app.get('/api/forecast/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  const item = ENERGY_DATA.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json(item);
})

// TODO
app.put('/api/forecast/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  // TODO
  res.status(200).json(req.body);
});

// TODO
app.delete('/api/forecast/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  // TODO
  // const item = ENERGY_DATA.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json({ deleted: item });
});

app.get('/api/archive', (req, res) => {
  let { page, limit } = req.query;
  page = Number.parseInt(page);
  limit = Number.parseInt(limit);
  
  res.header('Access-Control-Expose-Headers', 'X-Total-Count')
    .header('X-Total-Count', ENERGY_DATA.length)
    .status(200)
    .json(ENERGY_DATA.slice(page * limit, (page + 1) * limit));
});

// TODO
app.post('/api/archive', (req, res) => {
  // TODO
  res.status(200).json(req.body);
});

app.get('/api/archive/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  const item = ENERGY_DATA.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json(item);
});

// TODO
app.put('/api/archive/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  // TODO
  res.status(200).json(req.body);
});

// TODO
app.delete('/api/archive/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  // TODO
  // const item = ENERGY_DATA.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json({ deleted: item });
});

app.listen(port, () => {
  console.log(`GreenSpirit server listening on port ${port}`);
});