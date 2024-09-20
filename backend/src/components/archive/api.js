const express = require('express');
const router = express.Router();
const { addItem, removeItem, updateItem, getItem, getItems, getItemsCount } = require('./data-access');

router.get('/', (req, res) => {
  let { page, limit } = req.query;
  page = Number.parseInt(page);
  limit = Number.parseInt(limit);
  Promise.all([getItems(page * limit + 1, (page + 1) * limit + 1), getItemsCount()])
    .then(([items, count]) => {
      res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        .header('X-Total-Count', count)
        .status(200)
        .json(items);
    })
    .catch((error) => res.status(500).json({ error: error }));
});

// TODO
router.post('/', (req, res) => {
  // TODO
  res.status(200).json(req.body);
});

router.get('/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  getItem(id)
    .then((item) => res.status(200).json(item))
    .catch((error) => res.status(404).json({ error: 'Item not found' }));
});

// TODO
router.put('/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  // TODO
  res.status(200).json(req.body);
});

// TODO
router.delete('/:id', (req, res) => {
  let { id } = req.params;
  id = Number.parseInt(id);
  // TODO
  // const item = ENERGY_DATA.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json({ deleted: item });
});

module.exports = router;