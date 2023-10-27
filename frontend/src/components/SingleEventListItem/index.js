import './SingleEventListItem.css'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'

function SingleEventListItem({event}) {

    let history = useHistory()
    const routeChange = () => {
        let path = `/events/${event.id}`
        history.push(path)
    }

    let startDate = event.startDate.slice(0, 10)
                let hours = new Date(event.startDate).getHours()
                let AMorPM = hours >= 12  && hours < 24? 'PM' : 'AM'
                if(hours === 12 || hours === 0) hours = 12
                else {
                    hours = AMorPM === 'PM' ? hours - 12 : hours
                }
                let minutes = new Date(event.startDate).getMinutes()
                if(minutes === 0) minutes = `${minutes}0`
                let startTime = `${hours}:${minutes}`

    const [hover, setHover] = useState(false)
    const setHoverEffectsOn = () => {
        setHover(true)
    }
    const setHoverEffectsOff = () => {
        setHover(false)
    }


    return (
        <div className='eventlist-item-container'
        onClick={routeChange}
        onMouseEnter={setHoverEffectsOn}
        onMouseLeave={setHoverEffectsOff}
        >
            <div className='eventlist-item-top-container'>
                <img src={event.previewImage} className={`eventlist-img ${hover ? 'eventlist-img-hover': ''}`}/>
                <div className='eventlist-top-info-container'>
                    <div className='eventlist-date-time-container'>
                        <i class={`fa-solid fa-calendar-days ${hover ? 'fa-bounce': ''}`} style={{ color: "#ff1154" }}></i>
                        <h4>{startDate}</h4><i class="fa-solid fa-circle" style={{ color: "teal" }}></i><h4>{`${startTime}  ${AMorPM}`}</h4>
                    </div>
                    <h3 className={hover ? 'eventlist-name-hover': ''}>{event.name}</h3>
                    {event.venueId ? <h3>{event.Venue.city}, {event.Venue.state}</h3>: <h3>Online</h3>}
                </div>
            </div>
            <p>{event.description}</p>
        </div>
    )
}

export default SingleEventListItem;
