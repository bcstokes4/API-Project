const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')


// FOR VALIDATION ERRORS
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// FOR VALIDATING POST TO /
const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({max: 60})
        .withMessage('name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({min: 50})
        .withMessage('name must be 50 characters or more'),
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

//GETS ALL GROUPS JOINED/ORGANIZED BY CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const members = await Membership.findAll({
        attributes: ['groupId'],
        where: {
            userId: req.user.id,
            status: ['co-host', 'member']
        }
    })
    let groupIds = []
    members.forEach( memberObj => {
        let obj = memberObj.toJSON()
        groupIds.push(obj.groupId)
    })

    const Groups = await Group.findAll({
        where: {
            id: groupIds
        }
    })

    let arr = []

    const GroupImages = await GroupImage.findAll()
    const Members = await Membership.findAll()
    for (let i = 0; i < Groups.length; i++) {
        const groupObj = Groups[i].toJSON();

        for (let j = 0; j < GroupImages.length; j++) {
            const imgObj = GroupImages[j].toJSON()

            if(imgObj.groupId == i + 1 && imgObj.preview == true) {
                groupObj.previewImage = imgObj.url
            }
        }
        for (let k = 0; k < Members.length; k++) {
            const memberObj = Members[k].toJSON()

            if(memberObj.groupId == i + 1) {
                if(memberObj.status == 'member' || memberObj.status =='co-host') {
                     if(!groupObj.numMembers) groupObj.numMembers = 1
                    else {
                        groupObj.numMembers++
                    }
                }
            }
        }
        arr.push(groupObj)
    }

    res.json({
        Groups: arr
    })
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
        res.status(404)
        res.json({
            message: "Group couldn't be found"
        })
    }
    let memberCount = 0;
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

    res.json(
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
                     if(!groupObj.numMembers) groupObj.numMembers = 1
                    else {
                        groupObj.numMembers++
                    }
                }
            }
        }
        arr.push(groupObj)
    }


    res.json({
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
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    // cant authorize error
    if(group.organizerId != req.user.id) {
        res.status(403).json({
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

    res.json({
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

    res.status(201).json(newUser)
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
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    // cant authorize error
    if(group.organizerId != req.user.id) {
        res.status(403).json({
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

    res.json(group)
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
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    // cant authorize error
    if(group.organizerId != req.user.id) {
        res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group to edit Group'
        })
    }
    await group.destroy()

    res.json({
        message: 'Successfully deleted'
    })
})

module.exports = router;
