import './EventListPage.css'
import {useDispatch, useSelector} from 'react-redux'
import { getAllEventsThunk } from '../../store/events';
import { useEffect } from 'react';
import {Link} from 'react-router-dom'
import SingleEventListItem from '../SingleEventListItem';

function EventsListPage() {
    const eventsObj = useSelector( (state) => state.events)
    const events = Object.values(eventsObj)

    const dispatch = useDispatch()

    useEffect( () => {
        dispatch(getAllEventsThunk())
    }, [dispatch])

    return (
        <div className='events-main-container'>
            <div className='events-main-links'>
                <Link to='/events' className='events-main-event-link'>Events</Link>
                <Link to='/groups' className='events-main-groups-link'>Groups</Link>
            </div>

            <h4>Events in Mingle</h4>

            <div>
                {events.map( event => {
                   return <SingleEventListItem event={event}/>
                })}
            </div>
        </div>
    )
}

export default EventsListPage;
