const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'online'
  });
});

router.use('/circulating-supply', controller.circulatingSupply);
router.use('/total-supply', controller.totalSupply);

module.exports = router;
