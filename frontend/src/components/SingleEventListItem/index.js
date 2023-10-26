import './SingleEventListItem.css'
import { useHistory } from 'react-router-dom'
import {Link} from 'react-router-dom'

function SingleEventListItem({event}) {

    let history = useHistory()
    const routeChange = () => {
        let path = `/events/${event.id}`
        history.push(path)
    }

    let startDate = event.startDate.slice(0, 10)
                let hours = new Date(event.startDate).getHours()
                let minutes = new Date(event.startDate).getMinutes()
                let startTime = `${hours}:${minutes}:00`

    // console.log('eventttt', event)
    return (
        <div className='eventlist-item-container' onClick={routeChange}>
            <div className='eventlist-item-top-container'>
                <img src={event.previewImage}/>
                <div className='eventlist-top-info-container'>
                    <h4>{startDate} {startTime}</h4>
                    <h3>{event.name}</h3>
                    {event.venueId ? <h3>{event.Venue.city}, {event.Venue.state}</h3>: <h3>Online</h3>}
                </div>
            </div>
            <p>{event.description}</p>
        </div>
    )
}

export default SingleEventListItem;
