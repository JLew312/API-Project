const express = require('express');
const router = express.Router();
const { Booking,
        Review,
        ReviewsImage,
        Spot,
        SpotImage,
        User } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize')

router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { url } = req.body;

  const review = await Review.findOne({
    where: {id: req.params.reviewId}
  })

  const reviewId = req.params.reviewId;

  if (review) {
    await ReviewsImage.create({
      reviewId,
      url
    })

    const newImg = await ReviewsImage.findOne({
      where: {reviewId: req.params.reviewId},
      attributes: {exclude: ['reviewId', 'createdAt', 'updatedAt']}
    })

    res.json(newImg)
  } else if (!review) {
    res.json({
      message: "Review couldn't be found",
      statuscode: 404
    })
  }

})

module.exports = router;
