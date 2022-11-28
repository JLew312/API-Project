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
const reviewsimage = require('../../db/models/reviewsimage');
// const booking = require('../../db/models/booking');

router.get('/', requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
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

  if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
    res.json({
      message: "Validation Error",
      statuscode: 400,
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude is not valid",
        lng: "Longitude is not valid",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day is required"
      }
    })
  } else {
    const newSpot = await Spot.create({
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
  }
})

router.get('/current', requireAuth, async (req, res) => {
  const userSpots = await User.findOne({
    where: {id: req.user.id},
    include: [
      {
        model: Spot
      }
    ],
    attributes: {exclude: ['id', 'firstName', 'lastName', 'username']}
  })

  res.json(userSpots)
})

router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findOne({
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
  const spot = await Spot.findOne({
    where: {
      [Op.and]: [
        {id: req.params.spotId},
        {ownerId: req.user.id}
      ]
    }
  })

  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  } = req.body;

  if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
    res.json({
      message: "Validation Error",
      statuscode: 400,
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude is not valid",
        lng: "Longitude is not valid",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day is required"
      }
    })
  }

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
  const spot = await Spot.findOne({
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
  const spot = await Spot.findOne({
    where: {
      [Op.and]: [
        {id: req.params.spotId},
        {ownerId: req.user.id}
      ]
    }
  })

  if (spot) {
    const spotId = req.params.spotId

    if (req.params.spotId) {
      const newImg = await SpotImage.create({
        spotId,
        url,
        preview
      })

      const img = await SpotImage.findOne({
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
  } else {
    res.json({
      message: "you do not have permission to add image",
      statuscode: 403
    })
  }
})

router.get('/:spotId/reviews', async (req, res) => {
  const spotReviews = await Review.findAll({
    where: {spotId: req.params.spotId},
    include: [
      {
        model: User,
        attributes: {exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt']}
      },
      {
        model: ReviewsImage,
        attributes: {exclude: ['spotId', 'reviewId', 'createdAt', 'updatedAt']}
      }
    ]
  })

  if (spotReviews.length > 0) res.json(spotReviews)
  else res.json({
    message: "Spot couldn't be found",
    statuscode: 404
  })
})

router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  const { review, stars } = req.body;

  const spotId = req.params.spotId;
  const userId = req.user.id

  const userReview = await Review.findAll({
    where: {
      [Op.and]: [
        {spotId: spotId},
        {userId: userId}
    ]}
  })

  const spot = await Spot.findOne({
    where: { id: spotId }
  })

  if (!review || !stars) {
    res.json({
      message: "Validation error",
      statuscode: 400,
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      }
    })
  }

  if (spot) {
    if (userReview.length <= 0) {
      await Review.create({
        userId,
        spotId,
        review,
        stars
      })

      const reviews = await Review.findOne ({
        where: {spotId: req.params.spotId}
      })

      res.json(reviews)

    } else if (userReview.length > 0) {
      res.json({
        message: "User already has a review for this spot",
        statuscode: 403
      })
    }
  } else if (!spot) {
    res.json({
      message: "Spot couldn't be found",
      statuscode: 404
    })
  }
})

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;

  const realStartDate = new Date(startDate);
  const realEndDate = new Date(endDate);

  const spotId = req.params.spotId;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
   return res.json({
      message: "Spot couldn't be found",
      statuscode: 404
    })
  }

  const bookings = await Booking.findAll({
    where: {spotId: req.params.spotId}
  })

  let bookingList = []
  bookings.forEach(booking => {
    const bookingStart = new Date(booking.startDate)
    const bookingEnd = new Date(booking.endDate)
    console.log(bookingStart.getTime())

    if ((bookingStart.getTime() >= realStartDate.getTime() && bookingEnd.getTime() <= realEndDate.getTime()) ||
        (bookingStart.getTime() >= realStartDate.getTime() || bookingEnd.getTime() <= realEndDate.getTime())) {
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statuscode: 403,
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      })
    }
  })

  await Booking.create({
    spotId,
    userId,
    startDate,
    endDate
  })

  const bookedSpot = await Booking.findOne({
    where:{
      [Op.and]: [
        {spotId: spotId},
        {userId: userId}
      ]
    },
    attributes: {include: ['createdAt', 'updatedAt']}
  })

  res.json(bookedSpot)
})

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id

  const spot = await Spot.findByPk(req.params.spotId)

  // console.log(spot.ownerId);
  // console.log(userId)

  if (spot) {
    if (spot.ownerId === userId) {

      const bookings = await Spot.findOne({
        where: {id: spotId},
        include: [
          {
            model: User,
            attributes: {exclude: ['email', 'hashedPassword', 'username', 'createdAt', 'updatedAt']}
          },
          {
            model: Booking
          }
        ],
        attributes: {exclude: ['id', 'ownerId', 'createdAt', 'updatedAt', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price']}
      })

      return res.json(bookings)
    } else {
      const bookings = await Spot.findOne({
        where: {id: spotId},
        include: [
          {
            model: User,
            attributes: {exclude: ['id', 'firstName', 'lastName', 'email', 'hashedPassword', 'username', 'createdAt', 'updatedAt']}
          },
          {
            model: Booking,
            attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
          }
        ],
        attributes: {exclude: ['id', 'ownerId', 'createdAt', 'updatedAt', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price']}
      })

      return res.json(bookings)
    }
  } else {
    res.json({
      message: "Spot couldn't be found",
      message: 404
    })
  }

})

module.exports = router;
