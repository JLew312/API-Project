const express = require('express');
const router = express.Router();
const { Booking,
        Review,
        Spot,
        SpotImage,
        User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

router.get('/:current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      {
        model: SpotImage
      }
    ],
  })

  let bookingList = [];
  bookings.forEach(booking => {
    bookingList.push(booking.toJSON());
  })

  bookingList.forEach(booking => {
    booking.SpotImages.forEach(image => {
      if (image.preview === true) {
        booking.Spot.previewImage = image.url
      }
    })
    if (!booking.Spot.previewImage) {
      booking.Spot.previewImage = 'No preview image found.'
    }

    delete booking.SpotImages;
  })


  res.json(bookingList)
})

router.put('/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;

  const { startDate, endDate } = req.body;

  const today = new Date()
  const editStart = new Date(startDate);
  const editEnd = new Date(endDate);


  // const currBooking = await Booking.findOne({
  //   where: {
  //     [Op.and]: [
  //       {id: bookingId},
  //       {userId: userId}
  //     ]
  //   }
  // })

  const currBooking = await Booking.findByPk(bookingId)
  console.log(currBooking)

  if (!currBooking) {
    return res.json({
      message: "Booking couldn't be found",
      statuscode: 404
    })
  };

  if (currBooking.userId !== userId) {
    res.json({
      message: "You don't have permission to complete this action",
      statuscode: 403
    })
  }

  const bookings = await Booking.findAll({
    where: {spotId: currBooking.spotId}
  })

  const currBookingStart = new Date(currBooking.startDate);
  const currBookingEnd = new Date(currBooking.endDate);

  bookings.forEach(booking => {
    const bookingStart = new Date(booking.startDate) // previous start dates
    const bookingEnd = new Date(booking.endDate) // previous end dates

    if (editStart.getTime() >= bookingStart.getTime() && editStart.getTime() <= bookingEnd.getTime()) {
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statuscode: 403,
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      })
    }

    if (editEnd.getTime() >= bookingStart.getTime() && editEnd.getTime() <= bookingEnd.getTime()) {
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statuscode: 403,
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      })
    }

    if (editStart.getTime() <= bookingStart.getTime() && editEnd.getTime() >= bookingEnd.getTime()) {
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

  if (currBookingEnd.getTime() < today.getTime()) {
    return res.json({
      message: "Past bookings can't be modified",
      statuscode: 403
    })
  } else if (currBookingEnd.getTime() < currBookingStart.getTime()) {
    return res.json({
      message: "Validation error",
      statuscode: 403,
      errors: {
        endDate: "endDate cannot come before startDate"
      }
    })
  } else {
    await currBooking.update({
      startDate,
      endDate
    })

    return res.json(currBooking)
  }
})

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Booking.findOne({
    where: {
      [Op.and]: [
        {id: req.params.bookingId},
        {userId: req.user.id}
      ]
    }
  });

  const bookingEnd = new Date(booking.endDate);
  const today = new Date();

  if (booking) {
    if (bookingEnd.getTime() <= today.getTime()) {
      return res.json({
        message: "Bookings that have been started can't be deleted",
        statuscode: 403
      })
    } else {
      await booking.destroy();

      res.json({
        message: "Successfully deleted",
        statuscode: 200
      })
    }
  } else {
    res.json({
      message: "Booking couldn't be found",
      statuscode: 404
    })
  }
})


module.exports = router;
