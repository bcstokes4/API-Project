import './EventDetailsPage.css'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getOneGroupThunk } from '../../store/single-group';
import { getAllEventsThunk } from '../../store/events';
import { getOneEventThunk } from '../../store/single-event';


function EventDetailsPage() {
    let { eventId } = useParams()
    const dispatch = useDispatch()

    const group = useSelector(state => state.singleGroup)
    const event = useSelector(state => state.singleEvent)

    let groupId = event.groupId

    useEffect(() => {
        if (event && groupId) {
            dispatch(getOneGroupThunk(groupId))
        }
    }, [dispatch, groupId])
    useEffect(() => {
        dispatch(getOneEventThunk(eventId))
    }, [dispatch])

    let eventCheck = Object.values(event)
    let groupCheck = Object.values(group)

    if (!groupCheck.length) return null
    if (!eventCheck.length) return null


    let groupImages = group.GroupImages
    let urlGroup;
    for (let i = 0; i < groupImages.length; i++) {
        const obj = groupImages[i]

        if (obj.preview) {
            urlGroup = obj.url
        }
    }
    let eventImages = event.EventImages
    let urlEvent;
    for (let i = 0; i < eventImages.length; i++) {
        const obj = eventImages[i]

        if (obj.preview) {
            urlEvent = obj.url
        }
    }
    // DATE AND TIME
    let startDate = event.startDate.slice(0, 10)
                let hours = new Date(event.startDate).getHours()
                let minutes = new Date(event.startDate).getMinutes()
                if (minutes = '0') minutes = '00'
    let startTime = `${hours}:${minutes}:00`

    let endDate = event.endDate.slice(0, 10)
                let hours2 = new Date(event.endDate).getHours()
                let minutes2 = new Date(event.endDate).getMinutes()
                if (minutes2 = '0') minutes2 = '00'
    let endTime = `${hours2}:${minutes2}:00`

    return (
        <div className='event-details-main-div'>
            <div className='event-details-top-div'>
                <Link to='/events'> {"<"} Events </Link>
                <h1>{event.name}</h1>
                <h3>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
            </div>
            <div className='event-details-bottom-div'>
                <div className='event-details-bottom-upper-div'>
                    <img src={urlEvent} />
                    <div className='event-details-group-and-location-container'>
                        <div className='event-details-group-info-container'>
                            <img src={urlGroup} />
                            <div>
                                <h2>{group.name}</h2>
                                <h4>{group.private ? 'Private' : 'Public'}</h4>
                            </div>
                        </div>
                        <div className='event-details-event-info-container'>
                            <div className='event-details-time-div'>
                                <h3>Start: {startDate} - {startTime}</h3>
                                <h3>End: {endDate} - {endTime}</h3>
                           </div>
                           <h3>Price: {event.price == 0 ? 'Free': event.price}</h3>
                           {event.Venue && <h3>Location: {event.Venue ? `${event.Venue.address} ${event.Venue.city}, ${event.Venue.state}`: 'online'}</h3>}
                           <h3>Type: {event.type}</h3>
                        </div>
                    </div>
                </div>

                <div className='event-details-description-div'>
                    <h3>Details</h3>
                    <p>{event.description}</p>
                </div>
            </div>
        </div>
    )
}

export default EventDetailsPage;
