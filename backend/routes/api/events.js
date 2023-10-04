const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')


// FOR VALIDATION ERRORS
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateEvent = [
    check('venueId')
        .isCurrency({allow_decimal: false})
        .withMessage('Venue does not exist'),
    check('price')
        .exists({ checkFalsy: true })
        .isNumeric({
            min: 0,
            max: 5000
        })
        .withMessage('Price is invalid'),
    check('name')
        .exists({ checkFalsy: true })
        .isString(true)
        .isLength({min: 5})
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .isIn(['In person', 'Online'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .isCurrency({allow_decimal: false})
        .withMessage('Capacity must be an integer'),
    check('description')
        .exists({ checkFalsy: true })
        .isString(true)
        .isLength({min: 5})
        .withMessage('Description is required'),
    check('startDate')
        .isISO8601('yyyy-mm-dd')
        .isAfter('2023-01-01')
        .withMessage('Start date must be in the future'),
    handleValidationErrors
]

// DELETE AN EVENT SPECIFIED BY ITS ID
router.delete('/:eventId', requireAuth, async (req, res) => {
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        }
    })
    // cant find event error(404)
    if(!event) {
        res.status(404).json({
            message: "Event couldn't be found"
        })
    }
    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })

    const userMemberships = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id
        }
    })

    // AUTHENTICATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != 'co-host')) {
        res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to view venues'
        })
    }

    else {
        await event.destroy()

    res.json({
        message: "Successfully deleted"
      })
    }
})

// ADD AN IMAGE TO AN EVENT BASED ON EVENT'S ID
router.post('/:eventId/images', requireAuth, async (req, res) => {
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        }
    })
    if(!event) {
        res.status(404).json({
            message: "Event couldn't be found"
        })
    }
    // check if user is attending, organizer of group hosting event, or co-host of group hosting event
    const userAttendance = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.user.id
        }
    })
    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })
    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId
        }
    })
    if((!userAttendance || userAttendance.status != 'attending') && (group.organizerId != req.user.id) && (!membership || membership.status != 'co-host')) {
        res.status(403).json({
            name: 'Authorization Error',
            message: 'Current User must be an attendee, host, or co-host of the event'
        })
    }

    const {url, preview} = req.body
    const newImage = await EventImage.create({
        eventId: parseInt(req.params.eventId),
        url,
        preview
    })

    res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})


// EDIT AN EVENT SPECIFIED BY ITS ID
router.put('/:eventId', requireAuth, validateEvent, async (req, res) => {
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    if(endDate < startDate) {
        res.status(400).json({
            name: 'Validation Error',
            message: 'End date is less than start date'
        })
    }
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        }
    })
    // cant find event error(404)
    if(!event) {
        res.status(404).json({
            message: "Event couldn't be found"
        })
    }
    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })
    const venue = await Venue.findOne({
        where: {
            id: venueId
        }
    })
    // cant find venue error(404)
    if(!venue) {
        res.status(404).json({
            message: "Venue couldn't be found"
        })
    }
    const userMemberships = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id
        }
    })

    // AUTHENTICATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != 'co-host')) {
        res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to view venues'
        })
    }
    event.venueId = parseInt(venueId)
    event.name = name
    event.type = type
    event.capacity = parseInt(capacity)
    event.price = parseInt(price)
    event.description = description
    event.startDate = startDate
    event.endDate = endDate

    await event.save()
    res.json({
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
    })
})



// GET DETAILS OF AN EVENT SPECIFIED BY ID
router.get('/:eventId', async (req, res) => {
    const event = await Event.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: {
            id: req.params.eventId
        },
        include: [
            {
            model: Group,
            attributes: ['id', 'name', 'private' , 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'address','city', 'state', 'lat', 'lng']
        },
        {
            model: EventImage,
            attributes: ['id', 'url', 'preview']
        }
        ]
    })

    if(!event) {
        res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const Attendances = await Attendance.findAll()
    let numAttending = 0
    for (let k = 0; k < Attendances.length; k++) {
        const attendanceObj = Attendances[k].toJSON();

        if(attendanceObj.eventId == req.params.eventId) {
            if(attendanceObj.status == 'attending') {
                numAttending++
            }
        }
    }
    eventJSON = event.toJSON()
    eventJSON.numAttending = numAttending
    res.json(eventJSON)
})

// GET ALL EVENTS
router.get('/', async (req, res) => {
    const Events = await Event.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'description', 'capacity', 'price']},
        include: [
            {
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }
    ]
    })

    const EventImages = await EventImage.findAll()
    const Attendances = await Attendance.findAll()
let arr = []
    for (let i = 0; i < Events.length; i++) {
        const eventObj = Events[i].toJSON();


            for (let j = 0; j < EventImages.length; j++) {
                const imgObj = EventImages[j].toJSON();

                if(imgObj.eventId == eventObj.id && imgObj.preview == true) {
                    eventObj.previewImage = imgObj.url
                }
            }

            for (let k = 0; k < Attendances.length; k++) {
                const attendanceObj = Attendances[k].toJSON();

                if(attendanceObj.eventId == eventObj.id) {
                    if(attendanceObj.status == 'attending') {
                        if(!eventObj.numAttending) eventObj.numAttending = 1
                        else {
                            eventObj.numAttending++
                        }
                    }
                }
            }

            arr.push(eventObj)
    }



    res.json({Events: arr})
})




module.exports = router
