const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')


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

// CREATE A GROUP
// router.post('/', requireAuth, async (req, res) => {

// })






module.exports = router;
