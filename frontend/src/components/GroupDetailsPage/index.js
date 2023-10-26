import './GroupDetailsPage.css'
import { useParams, useHistory } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getOneGroupThunk } from '../../store/single-group';
import { getAllEventsThunk } from '../../store/events';
import { Link } from 'react-router-dom';
import GroupDetailsListEvents from '../GroupDetailsListEvents';


function GroupDetailsPage() {
    let { groupId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const group = useSelector(state => state.singleGroup)
    const eventsObj = useSelector(state => state.events)
    const sessionUser = useSelector((state) => state.session.user)

    const events = Object.values(eventsObj)

    useEffect(() => {
        dispatch(getOneGroupThunk(groupId))
        dispatch(getAllEventsThunk())
    }, [dispatch, groupId])

    const updateGroupRedirect = (e) => {
        e.preventDefault()
        
        history.push(`/groups/${groupId}/edit`)
    }

    let objCheck = Object.keys(group)

    if (!objCheck.length || !events.length) return null

    let eventCount = 0
    events.forEach(event => {
        if (event.groupId === group.id) eventCount++
    })


    let images = group.GroupImages
    let url;
    for (let i = 0; i < images.length; i++) {
        const obj = images[i]

        if (obj.preview) {
            url = obj.url
        }
    }
    let organizer = group.Organizer
    return (
        <div className='group-details-main-div'>
            <div className='group-details-top-div'>
                <div className='group-details-top-image-div'>
                    <Link to='/groups'> {"<"} Groups </Link>
                    <img src={`${url}`} alt='group-image' />
                </div>
                <div className='group-details-top-text-container'>
                    <div className='group-details-top-inner-container'>
                        <h2>{group.name}</h2>
                        <h3>{group.city}, {group.state}</h3>
                        <span>{eventCount} {eventCount === 1 ? 'Event' : 'Events'}</span> <span> {group.private ? ' - private' : ' - public'}</span>
                        <h4>Organized by  {organizer.firstName} {organizer.lastName}</h4>
                    </div>
                    {sessionUser && sessionUser.id !== organizer.id && (
                        <button onClick={() => alert('Feature Coming Soon...')}>
                            Join this group
                        </button>)}
                    {sessionUser && sessionUser.id === organizer.id && (
                        <div className='organizer-group-buttons-container'>
                            <button>Create Event</button>
                            <button onClick={(e) => updateGroupRedirect(e) }>Update</button>
                            <button>Delete</button>
                        </div>

                    )}
                </div>
            </div>
            <div className='group-details-events-div'>
                <div className='group-details-organizer-div'>
                    <h2>Organizer</h2>
                    <h4>{organizer.firstName} {organizer.lastName}</h4>
                </div>
                <div className='group-details-description-div'>
                    <h3>What we're about</h3>
                    <h4>{group.about}</h4>
                </div>
                <GroupDetailsListEvents events={events} groupId={groupId} />
            </div>
        </div>
    )
}

export default GroupDetailsPage;
