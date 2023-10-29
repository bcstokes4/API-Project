import './EventDetailsPage.css'
import { useParams, useHistory } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getOneGroupThunk } from '../../store/single-group';
import { getAllEventsThunk } from '../../store/events';
import { getOneEventThunk } from '../../store/single-event';
import { deleteOneEventThunk } from '../../store/events';

function EventDetailsPage() {
    let { eventId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const group = useSelector(state => state.singleGroup)
    const event = useSelector(state => state.singleEvent)
    const sessionUser = useSelector((state) => state.session.user)

    let groupId = event.groupId

    useEffect(() => {
        if (event && groupId) {
            dispatch(getOneGroupThunk(groupId))
        }
    }, [dispatch, groupId])
    useEffect(() => {
        dispatch(getOneEventThunk(eventId))
    }, [dispatch])


     // FOR DELETE EVENT MODAL
     const [isModalOpen, setIsModalOpen] = useState(false);
     const modalContainerRef = useRef();

     const openModal = () => {
         setIsModalOpen(true);
       };

       const closeModal = () => {
         setIsModalOpen(false);
       };

       // Close the modal if the click is outside the modal container
       const handleClickOutsideModal = (e) => {
           if (modalContainerRef.current && !modalContainerRef.current.contains(e.target)) {
           closeModal();
         }
       };
       useEffect(() => {
         if (isModalOpen) {
           document.addEventListener('mousedown', handleClickOutsideModal);
         } else {
           document.removeEventListener('mousedown', handleClickOutsideModal);
         }
         return () => {
           document.removeEventListener('mousedown', handleClickOutsideModal);
         };
       }, [isModalOpen]);

       const dispatchDelete = async (e) => {
         e.preventDefault()

         console.log('handling delete')
         const response = await dispatch(deleteOneEventThunk(eventId))


         if(response){
           history.push(`/groups/${group.id}`);
         }
       };


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
                let AMorPM = hours >= 12  && hours < 24? 'PM' : 'AM'
                if(hours === 12 || hours === 0) hours = 12
                else {
                    hours = AMorPM === 'PM' ? hours - 12 : hours
                }
                let minutes = new Date(event.startDate).getMinutes()
                if(minutes < 10) minutes = `0${minutes}`
                let startTime = `${hours}:${minutes}`

    let endDate = event.endDate.slice(0, 10)
                let hours2 = new Date(event.endDate).getHours()
                let AMorPM2 = hours2 >= 12  && hours < 24? 'PM' : 'AM'
                if(hours2 === 12 || hours2 === 0) hours = 12
                else {
                    hours2 = AMorPM2 === 'PM' ? hours2 - 12 : hours2
                }
                let minutes2 = new Date(event.endDate).getMinutes()
                if (minutes2 < 10) minutes2 = `0${minutes2}`
    let endTime = `${hours2}:${minutes2}`

    const redirectToGroup = () => {
      history.push(`/groups/${group.id}`)
    }
    return (
        <div className='event-details-main-div'>
            {isModalOpen && (
        <div className="delete-modal-container" >
          <div className="delete-modal-content" ref={modalContainerRef}>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <div className="delete-modal-buttons-container">
              <button className="delete-modal-confirm-button" onClick={dispatchDelete}>
                Yes (Delete Event)
              </button>
              <button className="delete-modal-revert-button" onClick={closeModal}>
                No (Keep Event)
              </button>
            </div>
          </div>
        </div>
      )}
            <div className='event-details-top-div'>
                <Link to='/events'> {"<"} Events </Link>
                <h1>{event.name}</h1>
                <h3>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
            </div>
            <div className='event-details-bottom-div'>
                <div className='event-details-bottom-upper-div'>
                    <img src={urlEvent} />
                    <div className='event-details-group-and-location-container'>
                        <div className='event-details-group-info-container'
                        onClick={redirectToGroup}
                        >
                            <img src={urlGroup} />
                            <div className='event-details-group-name-div'>
                                <h2>{group.name}</h2>
                                <h4>{group.private ? 'Private' : 'Public'}</h4>
                            </div>
                        </div>
                        <div className='event-details-event-info-container'>
                            <div className='event-details-time-div'>
                                <i class="fa-regular fa-clock eventlist-icon"></i>
                                <div className='start-end-time-div'>
                                  <div className='starttime-container'>
                                    <h3>Start: {startDate} </h3>
                                    <i class="fa-solid fa-circle lil-dot"></i>
                                    <h3>{`${startTime}  ${AMorPM}`}</h3>
                                  </div>
                                  <div className='endtime-container'>
                                    <h3>End: {endDate}</h3>
                                    <i class="fa-solid fa-circle lil-dot" ></i>
                                    <h3>{`${endTime}  ${AMorPM2}`}</h3>
                                  </div>
                                </div>
                           </div>
                           <div className='eventlist-price-div'>
                              <i class="fa-solid fa-dollar-sign eventlist-icon"></i>
                              <h3>  {event.price == 0 ? 'Free': event.price}</h3>
                           </div>
                           <div className='event-details-location-div'>

                              {event.Venue && <div className='event-details-location-mini-div'><i class="fa-solid fa-map-pin eventlist-icon"></i> <h3> {event.Venue && event.type !== 'Online' ? `${event.Venue.address} ${event.Venue.city}, ${event.Venue.state}`: 'Online'}</h3> </div>}
                              {event.Venue === null && <div className='event-details-location-mini-div'><i class="fa-solid fa-map-pin eventlist-icon"></i><h3> {event.type}</h3></div>}

                              {sessionUser?.id === group?.Organizer.id && <button onClick={(e) => openModal()} className='delete-event-button'>Delete Event</button>}
                           </div>

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
