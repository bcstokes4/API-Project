const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')


// FOR VALIDATION ERRORS
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


router.delete('/:imageId', requireAuth, async (req, res) => {

    const eventImage = await EventImage.findOne({
        where: {
            id: req.params.imageId
        }
    })

    if(!eventImage){
        return res.status(404).json({
            message: "Event Image couldn't be found"
        })
    }
    const event = await Event.findOne({
        where: {id: eventImage.eventId}
    })

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
            message: 'You must be the organizer or co-host of group hosting event to delete images'
        })
    }


    else{

        await eventImage.destroy()
        return res.json({
            "message": "Successfully deleted"
          })
    }
})


module.exports = router;
