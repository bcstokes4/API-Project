const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')

//GETS ALL GROUPS JOINED/ORGANIZED BY CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const Members = await Membership.findAll({
        attributes: ['groupId'],
        where: {
            userId: req.user.id,
            status: ['co-host', 'member']
        }
    })
    let groupIds = []
    Members.forEach( memberObj => {
        let obj = memberObj.toJSON()
        groupIds.push(obj.groupId)
    })



    res.json(groupIds)
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


module.exports = router;
