import './EventDetailsPage.css'
import {useParams} from 'react-router-dom'
import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import { getOneGroupThunk } from '../../store/single-group';
import { getAllEventsThunk } from '../../store/events';

function EventDetailsPage() {
    let {eventId} = useParams()
    const dispatch = useDispatch()

    const group = useSelector( state => state.singleGroup)
    const eventsObj = useSelector(state => state.events)

    const events = Object.values(eventsObj)

    let event = events.filter( event => event.id == eventId)[0]
    let groupId = event.groupId
    console.log('event', event)
    useEffect( () => {
        dispatch(getOneGroupThunk(groupId))
        dispatch(getAllEventsThunk())
    }, [dispatch])

    let objCheck = Object.keys(group)

    if(!objCheck.length || !events.length) return null

    let images = group.GroupImages
    let urlGroup;
    for (let i = 0; i < images.length; i++) {
        const obj = images[i]

        if(obj.preview) {
            urlGroup = obj.url
        }
    }

    return (
        <div className='event-details-main-div'>
            <div className='event-details-top-div'>
                <Link to='/groups'> {"<"} Events </Link>
                <h1>{event.name}</h1>
                <h3>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
            </div>
            <div className='event-details-bottom-div'>
                <div className='event-details-bottom-upper-div'>
                    <img src={event.previewImage}/>
                    <div className='event-details-group-and-location-container'>
                        <div className='event-details-group-info-container'>

                        </div>
                        <div className='event-details-event-info-container'>

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
