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
        .custom(val => {
            if(val < 0) return false
            if(Number(val) !== val) return false

            else return true
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


// DELETE ATTENDANCE TO AN EVENT SPECIFIED BY ID
router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
    const event = await Event.findOne({
        where: {id: req.params.eventId}
    })

    if(!event){
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    //Authorization: user must be organizer or co-host
    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })

    const {userId} = req.body

    if(group.organizerId != req.user.id && (userId != req.user.id)){
        return res.status(403).json({
            name: 'Authorization Error',
            message: "Only the User or organizer may delete an Attendance"
        })
    }

    const attendance = await Attendance.findOne({
        where: {
            userId,
            eventId: event.id
        }
    })
    if(!attendance){
        return res.status(404).json({
            message: "Attendance does not exist for this User"
        })
    }

    else {
        await attendance.destroy()

        return res.json({
            "message": "Successfully deleted attendance from event"
          })
    }
})


// CHANGE THE STATUS OF AN ATTENDANCE FOR AN EVENT SPECIFIED BY ID
router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    const event = await Event.findOne({
        where: {id: req.params.eventId}
    })

    if(!event){
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }
    const user = await User.findOne({
        where:{
            id: req.body.userId
        }
    })
    if(!user) {
        return res.status(400).json({
            message: "User couldn't be found"
        })
    }

    //Authorization: user must organizer or co-host
    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })
    const userMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    })
    if(group.organizerId != req.user.id && (!userMembership || userMembership.status != 'co-host')){
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer or co-host to change attendance status of a user'
        })
    }

    const {userId, status} = req.body
    if(!userId || !status) {
        return res.status(400).json({
            message: "userId and status required to change attendance"
        })
    }
    const attendance = await Attendance.findOne({
        where: {
            userId,
            eventId: event.id
        }
    })
    if(!attendance){
        return res.status(404).json({
            message: "Attendance between the user and the event does not exist"
        })
    }

    if(status == 'pending'){
        return res.status(400).json({
            message: "Cannot change an attendance status to pending"
        })
    }

    if(status != 'attending' && status != 'waitlist') {
        return res.status(400).json({
            message: "Allowed status values: 'attending', 'waitlist', and 'pending'."
        })
    }



    else{

        attendance.status = status
        await attendance.save()

        return res.json({
            id: attendance.id,
            eventId: attendance.eventId,
            userId: attendance.userId,
            status: attendance.status
        })

    }
})

// REQUEST TO ATTEND AN EVENT BASED ON THE EVENTS ID
router.post('/:eventId/attendance', requireAuth, async (req, res) => {
    const event = await Event.findOne({
        where: {id: req.params.eventId}
    })

    if(!event){
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }
    //Authorization: user must be a member of the group to request attendance
    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })
    const userMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    })
    if(group.organizerId != req.user.id && (!userMembership || userMembership.status == 'pending')){
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be a member of the group to request attendance to event'
        })
    }

    const attendance = await Attendance.findOne({
        where: {
            userId: req.user.id,
            eventId: event.id
        }
    })


    if(attendance && (attendance.status == 'pending' || attendance.status == 'waitlist')) {
       return res.status(400).json({
            message: "Attendance has already been requested"
        })
    }
    if(attendance && attendance.status == 'attending') {
        return res.status(400).json({
             message: "User is already an attendee of the event"
         })
     }

     else{

        let newAttendance = await Attendance.create({
            eventId: req.params.eventId,
            userId: req.user.id,
            status: 'pending'
        })

        return res.json({
            userId: req.user.id,
            status: newAttendance.status
        })
     }
})


// GET ALL ATTENDEES OF AN EVENT SPECIFIED BY ITS ID
router.get('/:eventId/attendees', async (req, res) => {

const event = await Event.findOne({
    where: {id: req.params.eventId}
})

if(!event){
    return res.status(404).json({
        message: "Event couldn't be found"
    })
}

const group = await Group.findOne({
    where: {
        id: event.groupId
    }
})
const userMembership = await Membership.findOne({
    where: {
        userId: req.user.id,
        groupId: group.id
    }
})


//NOT SURE ABOUT THIS PART, I THINK THAT ONLY MEMBERS SHOULD BE ABLE TO VIEW ATTENDEES BUT IDK
// AUTHORIZATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
// if(group.organizerId != req.user.id && (!userMembership || userMembership.status == 'pending')) {
//     return res.status(403).json({
//          name: 'Authorization Error',
//          message: 'You must be a member of the group to view attendees'
//      })
//  }



const attendees = await Attendance.findAll({
    where: {eventId: req.params.eventId},
    attributes: {
        exclude: ['createdAt', 'updatedAt', 'eventId']
    }
})
let arr = []

for (let i = 0; i < attendees.length; i++) {
    const attendeeObj = attendees[i].toJSON();
    const {userId, status} = attendeeObj
    const user = await User.findByPk(userId)
    const {firstName, lastName} = user

    // for non-host or co-host users
    if(group.organizerId != req.user.id || (userMembership && userMembership.status != 'co-host')) {
            if(attendeeObj.status == 'pending') continue
    }

    attendeeObj.firstName = firstName
    attendeeObj.lastName = lastName
    delete attendeeObj.userId

    attendeeObj.Attendance = {status}
    delete attendeeObj.status
    arr.push(attendeeObj)
}

    return res.json({Attendees: arr})
})

// DELETE AN EVENT SPECIFIED BY ITS ID
router.delete('/:eventId', requireAuth, async (req, res) => {
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        }
    })
    // cant find event error(404)
    if(!event) {
        return res.status(404).json({
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
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to delete events'
        })
    }

    else {
        await event.destroy()

    return res.json({
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
        return res.status(404).json({
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
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'Current User must be an attendee, host, or co-host of the event to add images'
        })
    }

    const {url, preview} = req.body
    const newImage = await EventImage.create({
        eventId: parseInt(req.params.eventId),
        url,
        preview
    })

    return res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})


// EDIT AN EVENT SPECIFIED BY ITS ID
router.put('/:eventId', requireAuth, validateEvent, async (req, res) => {
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    if(endDate < startDate) {
        return res.status(400).json({
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
        return res.status(404).json({
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
        return res.status(404).json({
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
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to edit an event'
        })
    }
    event.venueId = parseInt(venueId)
    event.name = name
    event.type = type
    event.capacity = parseInt(capacity)
    event.price = parseFloat(price)
    event.description = description
    event.startDate = startDate
    event.endDate = endDate

    await event.save()
    return res.json({
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: Number(event.price),
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
        return res.status(404).json({
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

    eventJSON.price = Number(eventJSON.price)
    eventJSON.Venue.lat = parseFloat(eventJSON.Venue.lat)
    eventJSON.Venue.lng = parseFloat(eventJSON.Venue.lng)

    return res.json(eventJSON)
})


const queryValidation = [
    check('page')
        .custom( val => {
            if(!val) return true
            if(val > 0 && val <= 10) return true

            else return false
        })
        .withMessage('Page must be greater than or equal to 1'),
    check('page')
        .custom( val => {
            if(!val) return true
            if(isNaN(val)) return false

            else return true
        })
        .withMessage('Page must be an integer'),
    check('size')
        .custom( val => {
            if(!val) return true
            if(val > 0 && val <= 20) return true
            else return false
        })
        .withMessage('Size must be greater than or equal to 1'),
    check('size')
        .custom( val => {
            if(!val) return true
            if(val > 0 && val <= 20) return true
            else return false
        })
        .withMessage('Size must be an integer'),
    check('name')
        .optional()
        .isString()
        .custom(val => {
            if(!val) return true
            if(val == Number(val)) return false
            if(typeof val === "string") return true
            else return false
        })
        .withMessage("Name must be a string"),
    check('type')
        .optional()
        .custom(val => {
            if(!val) return true
            if(val == 'In person' || val == "In person") return true
            if(val == 'Online' || val == "Online") return true

            else return false
        })
        .withMessage("Type must be 'Online' or 'In person'"),
    check('startDate')
        .optional()
        .isISO8601('yyyy-mm-dd')
        .isAfter('2023-01-01')
        .withMessage('Start date must be a valid date'),
    handleValidationErrors
]



const { Op } = require('sequelize')


// GET ALL EVENTS
router.get('/', queryValidation, async (req, res) => {
    // QUERY:
    let { page, size, name, type, startDate} = req.query
    let pagination = {}
    let whereObject = {}

    if(!page) page = 1
    if(!size) size = 20

    pagination.limit = size
    pagination.offset = (size * (page - 1))


    if(name) {
        whereObject.name = {[Op.substring]: name}
     }

    if(type) whereObject.type = type

    if(startDate) {
        // let test =
        // console.log(typeof test)
        // res.json(test)
       whereObject.startDate = new Date(startDate)
    }


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
    ],
    where: whereObject,
    ...pagination
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



    return res.json({
        Events: arr
    })
})




module.exports = router
