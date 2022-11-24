const express = require('express');
const router = express.Router();
const { Booking,
        Review,
        Spots,
        SpotImage,
        User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/', async (req, res) => {
  const spots = await Spots.findAll({
    include: [
      {
        model: Review
      },
      {
        model: SpotImage
      }
    ]
  })

  let spotsList = [];
  spots.forEach(spot => {
    spotsList.push(spot.toJSON())
  })

  spotsList.forEach(spot => {
    // iterate through spot variable to find SPOTIMAGE
    spot.SpotImages.forEach(image => {
      // iterate through SPOTIMAGE for preview boolean
      if (image.preview === true) {
        // if true, set previewImage to the given url
        spot.previewImage = image.url
      }
    })

    spot.Reviews.forEach(review => {
      let starTotal = 0;
      if (review.stars) {
        starTotal += review.stars;
      }
      spot.avgRating = (starTotal / spotsList.length).toFixed(2);
    })

    // console.log(spot.Reviews)

    // if no image.preview, set spot.previewImage to a string
    // 'no preview found' or the like
    if (!spot.previewImage) {
      spot.previewImage = 'No preview image found.'
    }

    if (!spot.avgRating) {
      spot.avgRating = 'This spot has yet to be rated. Be the first?'
    }

    delete spot.SpotImages;
    delete spot.Reviews;
  })

  res.json(spots)
})

module.exports = router;
