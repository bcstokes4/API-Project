import {useDispatch, useSelector} from 'react-redux'
import { getAllGroupsThunk } from '../../store/groups';
import { getAllEventsThunk } from '../../store/events';
import { useEffect } from 'react';
import SingleGroupListItem from '../SingleGroupListItem';

import {Link} from 'react-router-dom'
import './GroupsListPage.css'

function GroupsListPage() {
    const groupsObj = useSelector( (state) => state.groups)
    const groups = Object.values(groupsObj)

    const eventsObj = useSelector( (state) => state.events)
    const events = Object.values(eventsObj)

    const dispatch = useDispatch()

    useEffect( () => {
        dispatch(getAllGroupsThunk())
        dispatch(getAllEventsThunk())
    }, [dispatch])

    return (
        <div className='groups-main-container'>
            <div className='groups-main-links'>
                <Link to='/events' className='groups-main-event-link'>Events</Link>
                <Link to='/groups' className='groups-main-groups-link'>Groups</Link>
            </div>

            <h4>Groups in Mingle</h4>

            <div>
                {groups.map( group => {
                   return <SingleGroupListItem group={group} events={events}/>
                })}
            </div>
        </div>
    )
}

export default GroupsListPage;
