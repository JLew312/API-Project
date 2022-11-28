const express = require('express');
const router = express.Router();
const { Booking,
        Review,
        Spot,
        SpotImage,
        User } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize')

router.delete('/:imageId', requireAuth, async (req, res) => {
  // const image = await SpotImage.findOne({
  //   where: {id: req.params.imageId}
  // })

  // console.log(image)
  // res.json(image)

  console.log(req.params.imageId)
  res.json('hello')
})

module.exports = router;
