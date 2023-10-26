import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { getOneGroupThunk } from '../../store/single-group';
import { useEffect } from 'react';


function CreateEventForm(){

    let { groupId } = useParams()
    const dispatch = useDispatch()

    const sessionUser = useSelector((state) => state.session.user)
    const group = useSelector(state => state.singleGroup)

    useEffect(() => {
        dispatch(getOneGroupThunk(groupId))
    }, [dispatch, groupId])

    // MAKING SURE YOU CANT TYPE IN PATH TO GET HERE WITHOUT PROPER AUTHORIZATION
    if (!sessionUser || !group || sessionUser.id !== group.organizerId) {
        return <h1>You can't be here!!!!</h1>;
    }

    return (
        <div className='create-event-main-container'>
            <form className='create-event-form'>
                <h1>Create an event for {group.name}</h1>
                <label className='event-name-label'>
                    <h3>What is the name of your event?</h3>
                    <input
                    type='text'
                    placeholder='Event Name'
                    onChange=''
                    >
                        
                    </input>
                </label>
            </form>
        </div>
    )
}

export default CreateEventForm;
