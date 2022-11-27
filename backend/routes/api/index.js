const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const bookingsRouter = require('./bookings.js');
// const reviewsRouter = require('./review.js');
// const spotsImagesRouter = require('./spotimage.js');
// const reviewsImageRouter = require('./reviewsimage.js');
const { restoreUser } = require("../../utils/auth.js");


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/Users', usersRouter);
router.use('/Spots', spotsRouter);
router.use('/Bookings', bookingsRouter);
// router.use('/reviews', reviewsRouter);



router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
