const express = require('express');
const router = express.Router();
const { Booking,
        Review,
        Spots,
        SpotImage,
        User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/', requireAuth, async (req, res) => {
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

  return res.json(spotsList)
})

router.post('/', requireAuth, async (req, res) => {
  const ownerId = req.user.id
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const newSpot = await Spots.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })

  return res.json(newSpot)
})

router.get('/current', requireAuth, async (req, res) => {
  const userSpots = await User.findOne({
    where: {id: req.user.id},
    include: [
      {
        model: Spots
      }
    ],
    attributes: {exclude: ['id', 'firstName', 'lastName', 'username']}
  })

  res.json(userSpots)
})

router.get('/:spotId', async (req, res) => {
  const spot = await Spots.findOne({
    where: {id: req.params.spotId},
    include: [
      {
        model: Review
      },
      {
        model: SpotImage,
        attributes: {exclude: ['spotId', 'createdAt', 'updatedAt']}
      }
    ]
  });

  if (spot) {
    let newSpot = spot.toJSON()
    // console.log(newSpot)

    const owner = await User.findOne({
      where: {id: newSpot.ownerId},
      attributes: {exclude: ['username']}
    })

    newSpot.Owner = owner

    if (newSpot.Reviews.length >= 1) {
      newSpot.numReviews = newSpot.Reviews.length

      newSpot.Reviews.forEach(review => {
        let starTotal = 0;
        if (review.stars) starTotal += newSpot.Reviews.stars;
        newSpot.avgRating = (starTotal / newSpot.Reviews.length).toFixed(2);
      })
    } else if (newSpot.Reviews.length === 0) {
      newSpot.avgRating = 'No reviews have been made about this spot. Be the first?'
      newSpot.numReviews = newSpot.Reviews.length
    }

    delete newSpot.Reviews
    res.json(newSpot)
  } else {
    res.json({
      message: "Spot couldn't be found",
      statuscode: 404
    })
  }
})

router.put('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spots.findOne({
    where: {id: req.params.spotId}
  })

  if (spot) {
    spot.update(
      req.body
    )
    res.json(spot)
  } else {
    res.json({
      message: "Spot couldn't be found",
      statuscode: 404
    })
  }
})

router.delete('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spots.findOne({
    where: {id: req.params.spotId}
  });

  if (spot) {
    await spot.destroy();

    res.json({
      message: "Successfully deleted",
      statuscode: 200
    })
  } else {
    res.json({
      message: "Spot couldn't be found",
      statuscode: 404
    })
  }
})

router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spot = await Spots.findAll({
    where: {id: req.params.spotId}
  })

  const spotId = req.params.spotId

  if (req.params.spotId) {
    const newImg = await SpotImage.create({
      spotId,
      url,
      preview
    })

    const img = await SpotImage.findAll({
      where: {id: req.params.spotId},
      attributes: {exclude: ['spotId', 'createdAt', 'updatedAt']}
    })

    res.json(img)
  } else {
    res.json({
      message: "Spot couldn't be found",
      statuscode: 404
    })
  }
})

module.exports = router;
