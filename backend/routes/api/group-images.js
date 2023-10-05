const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')


// FOR VALIDATION ERRORS
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete('/:imageId', requireAuth, async (req, res) => {
    const groupImage = await GroupImage.findOne({
        where: {
            id: req.params.imageId
        }
    })
    // cant find group error(404)
    if(!groupImage) {
        return  res.status(404).json({
              message: "Group Image couldn't be found"
          })
      }

    const group = await Group.findOne({
        where: {
            id: groupImage.groupId
        }
    })

    const userMemberships = await Membership.findOne({
        where: {
            groupId: group.id,
            userId: req.user.id
        }
    })
    // AUTHORIZATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != 'co-host')) {
       return res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or be co-host to delete Group Image'
        })
    }

    else {
        await groupImage.destroy()
        return res.json({
            "message": "Successfully deleted"
          })
    }

})



module.exports = router;
