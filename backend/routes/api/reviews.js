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


router.get('/current', requireAuth, async (req, res) => {
  const userReviews = await Review.findAll({
    where: {userId: req.user.id},
    include: [
      {
        model: User,
        attributes: {exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt']}
      },
      {
        model: Spot,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      },
      {
        model: ReviewsImage,
        attributes: {exclude: ['spotId', 'reviewId', 'createdAt', 'updatedAt']}
      }
    ]
  })

  res.json(userReviews)
})

router.put('/:reviewId', requireAuth, async (req, res) => {
  const editReview = await Review.findOne({
    where: {
      [Op.and]: [
        {id: req.params.reviewId},
        {userId: req.user.id}
      ]
    }
  })

  const {
    review,
    stars
  } = req.body;

  if (!review || !stars) {
    res.json({
      message: "Validation Error",
      statuscode: 400,
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5"
      }
    })
  }

  if (editReview) {
    editReview.update(
      req.body
    )
    res.json(editReview)
  } else {
    res.json({
      message: "Spot couldn't be found",
      statuscode: 404
    })
  }
})

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const review = await Review.findOne({
    where: {
      [Op.and]: [
        {id: req.params.reviewId},
        {userId: req.user.id}
      ]
    }
  });

  if (review) {
    await review.destroy();

    res.json({
      message: "Successfully deleted",
      statuscode: 200
    })
  } else {
    res.json({
      message: "Review couldn't be found",
      statuscode: 404
    })
  }
})


router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { url } = req.body;

  const review = await Review.findOne({
    where: {
      [Op.and]: [
        {id: req.params.reviewId},
        {userId: req.user.id}
      ]
    },
    include: {model: ReviewsImage}
  })

  const reviewId = req.params.reviewId;

  if (review) {
    const reviewObj = review.toJSON();

    if (reviewObj.ReviewsImages.length >= 10) {
      res.json({
        message: "Maximum number of images for this resource was reached",
        statuscode: 400
      })
    }

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
