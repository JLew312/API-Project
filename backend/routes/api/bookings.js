const express = require('express');
const router = express.Router();
const { Booking,
        Review,
        Spots,
        SpotImage,
        User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


router.get('/:current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    include: [
      {
        model: Spots,
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


module.exports = router;
