import './GroupDetailsPage.css'
import { useParams, useHistory } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getOneGroupThunk } from '../../store/single-group';
import { getAllEventsThunk } from '../../store/events';
import { Link } from 'react-router-dom';
import GroupDetailsListEvents from '../GroupDetailsListEvents';
import { deleteOneGroupThunk } from '../../store/single-group';
import { useModal } from '../../context/Modal';

function GroupDetailsPage() {
    let { groupId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const group = useSelector(state => state.singleGroup)
    const eventsObj = useSelector(state => state.events)
    const sessionUser = useSelector((state) => state.session.user)

    // FOR DELETE GROUP MODAL
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
        const response = await dispatch(deleteOneGroupThunk(groupId))


        if(response){
          history.push(`/groups`);
        }
      };


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
            {isModalOpen && (
        <div className="delete-modal-container" >
          <div className="delete-modal-content" ref={modalContainerRef}>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <div className="delete-modal-buttons-container">
              <button className="delete-modal-confirm-button" onClick={dispatchDelete}>
                Yes (Delete Group)
              </button>
              <button className="delete-modal-revert-button" onClick={closeModal}>
                No (Keep Group)
              </button>
            </div>
          </div>
        </div>
      )}
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
                            <button onClick={(e) => openModal()}>Delete</button>
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
