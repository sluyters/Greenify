const express = require('express');
const router = express.Router();
const { getDayDetail, getDaysOverviewByPage, getDaysCount } = require('./data-access');

router.get('/', (req, res) => {
  let { page, limit } = req.query;
  page = page ? Number.parseInt(page) : 0;
  limit = limit ? Number.parseInt(limit) : 7;
  // TODO call new function but with pages
  Promise.all([getDaysOverviewByPage(page, limit), getDaysCount()])
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

router.get('/:date', (req, res) => {
  let { date } = req.params;
  getDayDetail(date)
    .then((item) => res.status(200).json(item))
    .catch((error) => res.status(404).json({ error: `Item not found: ${error}` }));
});

// TODO
router.put('/:date', (req, res) => {
  let { date } = req.params;
  // TODO
  res.status(200).json(req.body);
});

// TODO
router.delete('/:date', (req, res) => {
  let { date } = req.params;
  // TODO
  // const item = ENERGY_DATA.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json({ deleted: item });
});

module.exports = router;