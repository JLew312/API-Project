const express = require('express');
const router = express.Router();
const { Booking,
        Review,
        ReviewsImage,
        Spot,
        SpotImage,
        User } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize');

router.delete('/:imageId', requireAuth, async (req, res) => {
  const image = await ReviewsImage.findOne({
    where: {id: req.params.imageId},
    include: [
      {
        model: Review,
        where: {userId: req.user.id}
      }
    ]
  })

  if (image) {
    await image.destroy()

    res.status(200)
    return res.json({
      message: "Successfully deleted",
      statuscode: 200
    })
  } else {
    res.status(404)
    res.json({
      message: "Review Image couldn't be found",
      statuscode: 404
    })
  }
})


module.exports = router;
