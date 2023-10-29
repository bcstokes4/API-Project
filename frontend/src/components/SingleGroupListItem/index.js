import './SingleGroupListItem.css'
import { useHistory } from 'react-router-dom'
import {Link} from 'react-router-dom'
import { useState } from 'react'

function SingleGroupListItem({group, events}) {
    let eventCount = 0
    events.forEach( event => {
        if(event.groupId === group.id) eventCount++
    })

    let history = useHistory()
    const routeChange = () => {
        let path = `/groups/${group.id}`
        history.push(path)
    }

    const [hover, setHover] = useState(false)
    const setHoverEffectsOn = () => {
        setHover(true)
    }
    const setHoverEffectsOff = () => {
        setHover(false)
    }

    return (
        <div className={`grouplist-item-container ${hover ? 'grouplist-container-hover': ''}`}
        onMouseEnter={setHoverEffectsOn}
        onMouseLeave={setHoverEffectsOff}
        onClick={routeChange}
        >
            <img src={group.previewImage} className={`grouplist-img ${hover ? 'grouplist-img-hover': ''}`}/>
            <div className='grouplist-item-text-container'>
                <h2 className={hover ? 'grouplist-name-hover': ''}>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <p>{group.about}</p>
                <div>
                <span>{eventCount} {eventCount === 1 ? 'Event': 'Events'}</span> <span> {group.private ? ' - Private': ' - Public'}</span>
                </div>
            </div>
        </div>
    )
}



export default SingleGroupListItem;
