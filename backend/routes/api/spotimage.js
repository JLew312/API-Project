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
  const image = await SpotImage.findOne({
    where: {id: req.params.imageId}
  })

  if (image) {
    await image.destroy()

    res.json({
      message: "Successfully deleted",
      statuscode: 200
    })
  } else {
    res.json({
      message: "Spot Image couldn't be found",
      statuscode: 404
    })
  }
})

module.exports = router;
