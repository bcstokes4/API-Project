const router = require('express').Router();
const sessionRouter = require('./session.js')
const usersRouter = require('./users.js')
const groupsRouter = require('./groups.js')
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser)

router.use('/groups', groupsRouter)
router.use('/session', sessionRouter)
router.use('/users', usersRouter)

router.post('/test', (req, res) => {
    res.json({requestBody: req.body})
})


module.exports = router;
