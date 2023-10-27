import './SingleGroupListItem.css'
import { useHistory } from 'react-router-dom'
import {Link} from 'react-router-dom'

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
    return (
        <div className='grouplist-item-container' onClick={routeChange}>
            <img src={group.previewImage} className='grouplist-img'/>
            <div className='grouplist-item-text-container'>
                <h2>{group.name}</h2>
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
