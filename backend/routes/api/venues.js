const express = require('express')
const router = express.Router();
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')


// FOR VALIDATION ERRORS
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

// EDIT VENUE BY ID
router.put('/:venueId', requireAuth, validateVenue, async ( req, res) => {

    //venue specified
    const venue = await Venue.findOne({
        where: {
            id: req.params.venueId
        }
    })
    // cant find group error(404)
    if(!venue) {
        res.status(404).json({
            message: "Venue couldn't be found"
        })
    }
    //group tied to the venue
    const group = await Group.findOne({
        where: {
            id: venue.groupId
        }
    })
    //current user's membership record to the group linked to venue
    const userMemberships = await Membership.findOne({
        where: {
            groupId: venue.groupId,
            userId: req.user.id
        }
    })

    // let groupJSON = group.toJSON()
    // let memberJSON = userMemberships.toJSON()
    // AUTHENTICATION: CURRENT USER MUST BE ORGANIZER OF GROUP OR CO-HOST
    if(group.organizerId != req.user.id && (!userMemberships || userMemberships.status != "co-host")) {
        res.status(403).json({
            name: 'Authorization Error',
            message: 'You must be the organizer of the group or have co-host status to view venues'
        })
    }
    const {address, city, state, lat, lng} = req.body
    venue.address = address
    venue.city = city
    venue.state = state
    venue.lat = lat
    venue.lng = lng

    await venue.save()

    res.json({
        id: venue.id,
        groupId: venue.groupId,
        city: venue.city,
        state: venue.state,
        lat: parseFloat(venue.lat),
        lng: parseFloat(venue.lng)
    })
})

module.exports = router;
