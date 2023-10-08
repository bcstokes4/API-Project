const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership, Venue, User, Event, EventImage, Attendance } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')


// FOR VALIDATION ERRORS
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// FOR VALIDATING POST TO /
const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({max: 60})
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({min: 50})
        .withMessage('About must be 50 characters or more'),
    check('type')
        .isIn(['In person', 'Online'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .isBoolean(true)
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true })
        .isString(true)
        .isLength({min: 2})
        .withMessage("City is required"),
    check('state')
    .exists({ checkFalsy: true })
    .isString(true)
    .isLength({min: 2})
    .withMessage("State is required"),
    handleValidationErrors
]
//FOR VALIDATING NEW VENUE
const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
        .custom(val => {
            if(!val) return false
            if(val < -90 || val > 90) return false

            else return true
        })
        .withMessage('Latitude is not valid'),
    check('lng')
        .custom(val => {
            if(!val) return false
            if(val < -180 || val > 180) return false

            else return true
        })
        .withMessage('Longitude is not valid'),
    handleValidationErrors
]

// FOR VALIDATING A NEW EVENT
const validateEvent = [
    check('price')
        .custom(val => {
            if(val < 0) return false
            if(isNaN(val)) return false

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

//CHANGE STATUS OF MEMBERSHIP FOR A GROUP SPECIFIED BY ID
router.put('/:groupId/membership', requireAuth, async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
       return res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    const userMemberships = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            userId: req.user.id
        }
    })
    // AUTHORIZATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != 'co-host')) {
       return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or be co-host to edit memberships'
        })
    }

    else {

        const {memberId, status} = req.body
        if(status == 'pending'){
            return res.status(400).json({
                "message": "Validations Error",
                "errors": {
                  "status" : "Cannot change a membership status to pending"
                }
              })
        }

        let user = await User.findOne({where: {id: memberId}})
        if(!user){
            return res.status(400).json({
                "message": "User couldn't be found"
              })
        }
        const membership = await Membership.findOne({
            where: {
                userId: memberId,
                groupId: req.params.groupId
            }
        })
        if(!membership){
            return res.status(400).json({
                "message": "Membership between the user and the group does not exist"
              })
        }



        const userMembership = await Membership.findOne({
            where: {
                groupId: req.params.groupId,
                userId: req.user.id
            }
        })
        // if user status is co-host and they try to make someone co-host throw error
        if(status == 'co-host' && (userMembership && userMembership.status == 'co-host')){
            return res.status(403).json({
                "name": "Authorization Error",
                "message": "You must be group organizer to change membership status to co-host"
              })
        }


        else {
            membership.status = status
            await membership.save()

            return res.json({
                id: membership.id,
                groupId: membership.groupId,
                memberId: membership.userId,
                status: membership.status
            })
        }
    }


 })



//DELETE MEMBERSHIP TO A GROUP SPECIFIED BY ID
router.delete('/:groupId/membership', requireAuth, async (req, res) => {
    const {memberId} = req.body
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
       return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    let user = await User.findOne({
        where: {
            id: req.body.memberId
        }
    })
    if(!user){
       return res.status(400).json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
          })
    }
    let membership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId
        }
    })
    // return res.json(membership)
    if(!membership) {
        return res.status(404).json({
             message: "Membership does not exist for this User"
         })
     }
    if(group.organizerId != req.user.id && membership.userId != req.user.id){
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or be the owner of the membership to delete'
        })
    }

    else {
        // const membership = await Membership.findOne({
        //     where: {id: req.body.memberId}
        // })
       await membership.destroy()

       return res.json({
        "message": "Successfully deleted membership from group"
      })
    }
})

// REQUEST MEMBERSHIP FOR A GROUP BASED ON THE GROUPS ID
router.post('/:groupId/membership', requireAuth, async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    if(group.organizerId == req.user.id){
        return res.status(400).json({
            message: "User is already a member of the group"
        })
    }
    // check if already a member or already requested membership
    const membershipCheck = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId
        }
    })
    if(membershipCheck){
        if(membershipCheck.status == 'pending') {
            return res.status(400).json({
                message: "Membership has already been requested"
            })
        }
            if(membershipCheck.status == 'member' || membershipCheck.status == 'co-host') {
                return res.status(400).json({
                    message: "User is already a member of the group"
                })
            }

    }

    else {
        const newMember = await Membership.create({
            userId: req.user.id,
            groupId: req.params.groupId,
            status: 'pending'
        })

        return res.json({
            memberId: req.user.id,
            status: newMember.status
        })
    }
})

// GET ALL MEMBERS OF A GROUP SPECIFIED BY ITS ID
router.get('/:groupId/members', async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    const userMemberships = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            userId: req.user.id
        }
    })
    // AUTHORIZATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST OR MEMBER TO VIEW ANY MEMBERSHIP
    // if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status == 'pending')) {
    //     return res.status(403).json({
    //         name: 'Authorization Error',
    //         message: 'You must be a member of the group to view members'
    //     })
    // }

    // For users that are either members, co-hosts or organizers of the group:

    let members = await Membership.findAll({
        attributes: ['id', 'userId','status'],
        where: {
            groupId: req.params.groupId
        }
    })

    // if you are the organizer or co-host:
    if(group.organizerId == req.user.id) {
        let arr = []
        for (let i = 0; i < members.length; i++) {
            const memberObj = members[i].toJSON();
            const {id, userId, status} = memberObj

            memberObj.Membership = {status}
            delete memberObj.status

            const user = await User.findOne({
                attributes: ['firstName', 'lastName'],
                where: {id: userId}
            })
            const {firstName, lastName} = user
            memberObj.firstName = firstName
            memberObj.lastName = lastName
            delete memberObj.userId

            arr.push(memberObj)
        }

    return res.json({
        Members: arr
    })
    }

    // if you are NOT an organizer/co-host of the group:
        let arr = []
        for (let i = 0; i < members.length; i++) {
            const memberObj = members[i].toJSON();
            const {id, userId, status} = memberObj

            if(status != 'pending'){

                memberObj.Membership = {status}
                delete memberObj.status

                const user = await User.findOne({
                    attributes: ['firstName', 'lastName'],
                    where: {id: userId}
                })
                const {firstName, lastName} = user
                memberObj.firstName = firstName
                memberObj.lastName = lastName
                delete memberObj.userId

                arr.push(memberObj)
            }
        }

    return res.json({
        Members: arr
    })


})

// CREATE AN EVENT FOR A GROUP SPECIFIED BY ITS ID
router.post('/:groupId/events', requireAuth, validateEvent, async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
       return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    const userMemberships = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            userId: req.user.id
        }
    })

    // AUTHENTICATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != 'co-host')) {
       return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to create event'
        })
    }
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body


    let venue = await Venue.findOne({
        where: {
            id: venueId
        }
    })
    if(!venue) {
        return res.status(400).json({
            name: 'Validation Error',
            message: 'Venue does not exist'
        })
    }
    if(endDate < startDate) {
       return res.status(400).json({
            name: 'Validation Error',
            message: 'End date is less than start date'
        })
    }

    const newEvent = await Event.create({
        groupId: parseInt(req.params.groupId),
        venueId,
        name, type, capacity,
        price: price,
        description,
        startDate,
        endDate
    })


    return res.json({
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: Number(newEvent.price),
        description: newEvent.description,
        startDate: startDate,
        endDate: endDate
    })
})

// GET ALL EVENTS OF A GROUP SPECIFIED BY ITS ID
router.get('/:groupId/events', async (req, res) => {
    const Events = await Event.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'description', 'capacity', 'price']},
        where: {
            groupId: req.params.groupId
        },
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
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    if(!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }

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



    return res.json({Events: arr})
})



// GET ALL VENUES FOR A GROUP SPECIFIED BY ITS ID
router.get('/:groupId/venues', requireAuth, async (req, res) => {

    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    const userMemberships = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            userId: req.user.id
        }
    })

    // AUTHENTICATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != "co-host")) {
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to view venues'
        })
    }
    const venues = await Venue.findAll({
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
        where: {
            groupId: req.params.groupId
        }
    })
    let venuesArr = []
    for (let i = 0; i < venues.length; i++) {
        const venueObj = venues[i].toJSON();

        venueObj.lat = parseFloat(venueObj.lat)
        venueObj.lng = parseFloat(venueObj.lng)

        venuesArr.push(venueObj)
    }
    return res.json({
        Venues: venuesArr
    })
})

// CREATE A NEW VENUE FOR A GROUP SPECIFIED BY ITS ID
router.post('/:groupId/venues', requireAuth, validateVenue, async (req, res) => {

    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    const userMemberships = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            userId: req.user.id
        }
    })
    // AUTHENTICATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != 'co-host')) {
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to create venues'
        })
    }
    const {address, city, state, lat, lng} = req.body
    const newVenue = await Venue.create({
        groupId: req.params.groupId,
        address,
        city,
        state,
        lat,
        lng
    })

    return res.json({
        id: newVenue.id,
        groupId: parseInt(newVenue.groupId),
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: parseFloat(newVenue.lat),
        lng: parseFloat(newVenue.lng)
    })
})


//GETS ALL GROUPS JOINED/ORGANIZED BY CURRENT USER
router.get('/current', requireAuth, async (req, res) => {




    const Groups = await Group.findAll()
    const GroupImages = await GroupImage.findAll()
    const Members = await Membership.findAll()

    let arr = []
    let groupIdsForUser = []

    for (let i = 0; i < Groups.length; i++) {
        const groupObj = Groups[i].toJSON();

        if(groupObj.organizerId == req.user.id) groupIdsForUser.push(groupObj.id)

            for (let j = 0; j < GroupImages.length; j++) {
                const imgObj = GroupImages[j].toJSON()

                if(imgObj.groupId == groupObj.id && imgObj.preview == true) {
                    groupObj.previewImage = imgObj.url
                }
            }
            for (let k = 0; k < Members.length; k++) {
                const memberObj = Members[k].toJSON()

                if(memberObj.groupId == groupObj.id) {
                    if(memberObj.status == 'member' || memberObj.status =='co-host') {

                        if(memberObj.userId == req.user.id) groupIdsForUser.push(groupObj.id)

                        if(!groupObj.numMembers) groupObj.numMembers = 2
                        else {
                            groupObj.numMembers++
                        }
                    }
                }

                if(!groupObj.numMembers && k == Members.length - 1) groupObj.numMembers = 1
            }



        arr.push(groupObj)
    }

    let finalGroups = []
    for (let i = 0; i < arr.length; i++) {
        const groupObj = arr[i];

        if(groupIdsForUser.includes(groupObj.id)){
            finalGroups.push(groupObj)
        }
    }
    return res.json({
        Groups: finalGroups
    })
    // const userMemberships = await Membership.findAll({
    //     attributes: ['groupId'],
    //     where: {
    //         userId: req.user.id,
    //         status: ['co-host', 'member']
    //     }
    // })


    // res.json(userMemberships)


    // const members = await Membership.findAll({
    //     attributes: ['groupId'],
    //     where: {
    //         userId: req.user.id,
    //         status: ['co-host', 'member']
    //     }
    // })
    // let groupIds = []
    // members.forEach( memberObj => {
    //     let obj = memberObj.toJSON()
    //     groupIds.push(obj.groupId)
    // })

    // const Groups = await Group.findAll({
    //     where: {
    //         id: groupIds
    //     }
    // })

    // let arr = []

    // const GroupImages = await GroupImage.findAll()
    // const Members = await Membership.findAll()
    // for (let i = 0; i < Groups.length; i++) {
    //     const groupObj = Groups[i].toJSON();

    //     for (let j = 0; j < GroupImages.length; j++) {
    //         const imgObj = GroupImages[j].toJSON()

    //         if(imgObj.groupId == i + 1 && imgObj.preview == true) {
    //             groupObj.previewImage = imgObj.url
    //         }
    //     }
    //     for (let k = 0; k < Members.length; k++) {
    //         const memberObj = Members[k].toJSON()

    //         if(memberObj.groupId == i + 1) {
    //             if(memberObj.status == 'member' || memberObj.status =='co-host') {
    //                  if(!groupObj.numMembers) groupObj.numMembers = 1
    //                 else {
    //                     groupObj.numMembers++
    //                 }
    //             }
    //         }
    //     }
    //     arr.push(groupObj)
    // }

    // res.json({
    //     Groups: arr
    // })

})


// GET DETAILS OF A GROUP FROM AN ID
router.get('/:groupId', async (req, res) => {


    const groups = await Group.findAll({
        where: {
            id: req.params.groupId
        },
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Venue,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ]
    })
    if(!groups.length) {

        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    let memberCount = 1;
    const Members = await Membership.findAll()
    for (let i = 0; i < Members.length; i++) {
        const memberObj = Members[i].toJSON();

        if(memberObj.groupId == req.params.groupId) {
            if(memberObj.status =='member' || memberObj.status == 'co-host') {
                memberCount++
            }
        }

    }


    const groupsJSON = groups[0].toJSON()
    groupsJSON.numMembers = memberCount

    const organizer = await User.findOne({
        where: {
            id: groupsJSON.organizerId
        },
        attributes: ['id', 'firstName', 'lastName']
    })

    groupsJSON.Organizer = organizer

    return res.json(
        groupsJSON
    )
})

//GET ALL GROUPS
router.get('/', async (req, res) => {

    const Groups = await Group.findAll()
    const GroupImages = await GroupImage.findAll()
    const Members = await Membership.findAll()

    let arr = []

    for (let i = 0; i < Groups.length; i++) {
        const groupObj = Groups[i].toJSON();

        for (let j = 0; j < GroupImages.length; j++) {
            const imgObj = GroupImages[j].toJSON()

            if(imgObj.groupId == groupObj.id && imgObj.preview == true) {
                groupObj.previewImage = imgObj.url
            }
        }
        for (let k = 0; k < Members.length; k++) {
            const memberObj = Members[k].toJSON()

            if(memberObj.groupId == groupObj.id) {
                if(memberObj.status == 'member' || memberObj.status =='co-host') {
                     if(!groupObj.numMembers) groupObj.numMembers = 2
                    else {
                        groupObj.numMembers++
                    }
                }
            }
            if(!groupObj.numMembers && k == Members.length -1) groupObj.numMembers = 1
        }
        arr.push(groupObj)
    }


    return res.json({
        Groups: arr
    })

})

// ADD AN IMAGE TO A GROUP BASED ON THE GROUP'S ID
router.post('/:groupId/images', requireAuth, async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
       return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    // cant authorize error
    if(group.organizerId != req.user.id) {
       return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group to add pictures'
        })
    }
    const { url, preview } = req.body
    const newGroupImage = await GroupImage.create({
        groupId: req.params.groupId,
        url,
        preview
    })

    return res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview
    })
})

// CREATE A GROUP
router.post('/', requireAuth, validateNewGroup, async (req, res) => {

    const {name, about, type, private, city, state} = req.body

    const newUser = await Group.create({
        organizerId: req.user.id,
        name,
        about,
        type,
        private,
        city,
        state,
    })

    return res.status(201).json(newUser)
})

// EDIT A GROUP
router.put('/:groupId', requireAuth, validateNewGroup, async (req, res) => {

    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
       return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    // cant authorize error
    if(group.organizerId != req.user.id) {
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group to edit Group'
        })
    }

    const {name, about, type, private, city, state} = req.body

    group.name = name
    group.about = about
    group.type = type
    group.private = private
    group.city = city
    group.state = state

    await group.save()

    return res.json(group)
})

// DELETE A GROUP

router.delete('/:groupId', requireAuth, async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        }
    })
    // cant find group error(404)
    if(!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    // cant authorize error
    if(group.organizerId != req.user.id) {
        return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group to delete Group'
        })
    }

    else {
        await group.destroy()

    return res.json({
        message: 'Successfully deleted'
    })
    }
})



module.exports = router;
