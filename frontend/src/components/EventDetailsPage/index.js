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
                if(minutes === 0) minutes = `${minutes}0`
                let startTime = `${hours}:${minutes}`

    let endDate = event.endDate.slice(0, 10)
                let hours2 = new Date(event.endDate).getHours()
                let AMorPM2 = hours2 >= 12  && hours < 24? 'PM' : 'AM'
                if(hours2 === 12 || hours2 === 0) hours = 12
                else {
                    hours2 = AMorPM2 === 'PM' ? hours2 - 12 : hours2
                }
                let minutes2 = new Date(event.endDate).getMinutes()
                if (minutes2 === 0) minutes2 = `${minutes2}0`
    let endTime = `${hours2}:${minutes2}`



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
                        <div className='event-details-group-info-container'>
                            <img src={urlGroup} />
                            <div>
                                <h2>{group.name}</h2>
                                <h4>{group.private ? 'Private' : 'Public'}</h4>
                            </div>
                        </div>
                        <div className='event-details-event-info-container'>
                            <div className='event-details-time-div'>
                                <h3>Start: {startDate} - {`${startTime}  ${AMorPM}`}</h3>
                                <h3>End: {endDate} - {`${endTime}  ${AMorPM2}`}</h3>
                           </div>
                           <h3>Price: {event.price == 0 ? 'Free': event.price}</h3>
                           {event.Venue && <h3>Location: {event.Venue && event.type !== 'Online' ? `${event.Venue.address} ${event.Venue.city}, ${event.Venue.state}`: 'Online'}</h3>}
                           <h3>Type: {event.type}</h3>

                        {sessionUser?.id === group?.Organizer.id && <button onClick={(e) => openModal()}>Delete Event</button>}
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
