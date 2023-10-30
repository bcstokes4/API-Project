import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { getOneGroupThunk } from '../../store/single-group';
import { useEffect, useState } from 'react';
import { csrfFetch } from '../../store/csrf';
import { postOneEventThunk } from '../../store/events';
import { postOneEventImage } from '../../store/events';
import './CreateEventForm.css'

function CreateEventForm() {

    let { groupId } = useParams()
    const dispatch = useDispatch()

    const sessionUser = useSelector((state) => state.session.user)
    const group = useSelector(state => state.singleGroup)

    const history = useHistory()
    const [name, setName] = useState('')
    const [type, setType] = useState('');
    const [visibility, setVisibility] = useState('');
    const [price, setPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [errors, setErrors] = useState({})
    const [errorsOnSubmit, setErrorsOnSubmit] = useState({})

    const resetVariables = () => {
        setName('')
        setType('')
        setVisibility('')
        setPrice(0)
        setStartDate('')
        setEndDate('')
        setDescription('')
        setUrl('')
        setErrors({})
        setErrorsOnSubmit({})
    }

    useEffect(() => {
        const initialFetch = async() => {
            try {
                if(groupId != Number(groupId)){
                    history.push('/groups')
                }
              await dispatch(getOneGroupThunk(groupId))
            }
            catch(error) {
            }
           }
           initialFetch()
    }, [dispatch, groupId])

    function isImgUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
        const lowerCaseUrl = url.toLowerCase();

        return imageExtensions.some(extension => lowerCaseUrl.includes(extension));
    }

    const onSubmit = async (e) => {
        e.preventDefault()


        let errorsObj = {}

        if (name.length < 2 || name.length > 60) {
            errorsObj.name = 'Name must be 60 characters or less'
        }
        if (!name.length) {
            errorsObj.name = 'Name is required'
        }
        if (!description.length) {
            errorsObj.description = 'Description is required'
        }
        if (description.length < 50) {
            errorsObj.description = 'Description must be 50 characters or more'
        }
        if (type !== 'Online' && type != 'In person') {
            errorsObj.type = 'Group Type is required'
        }
        if (visibility !== 'Private' && visibility !== 'Public') {
            errorsObj.visibility = 'Visibility Type is required'
        }
        if (price < 0) errorsObj.price = 'Invalid price'
        if (!price) errorsObj.price = 'Price is required'

        let currentDate = new Date()
        let startDateCheck = new Date(startDate)

        if (startDateCheck <= currentDate) errorsObj.startDate = 'Event start must be in the future'

        if (startDate > endDate) {
            errorsObj.endDate = 'Event end must be after event start'
        }
        if (!startDate.length) errorsObj.startDate = 'Event start is required'
        if (!endDate.length) errorsObj.endDate = 'Event end is required'

        if (!isImgUrl(url)) {
            errorsObj.url = 'Url must be jpg, jpeg or png'
        }


        const requestBody = {
            venueId: parseInt(group.Venues[0].id),
            name,
            type,
            price: Math.floor(price * 100) / 100,
            capacity: 25,
            description,
            startDate,
            endDate
        }
        const imageReqBody = { url, preview: true }
        if (!Object.values(errorsObj).length) {

            try {
                const attempt = await dispatch(postOneEventThunk(groupId, requestBody))
                await dispatch(postOneEventImage(attempt.id, imageReqBody))
                resetVariables()
                history.push(`/events/${attempt.id}`);
            }
            catch {

            }
        }

        setErrorsOnSubmit({ ...errorsObj })
    }

    // MAKING SURE YOU CANT TYPE IN PATH TO GET HERE WITHOUT PROPER AUTHORIZATION
    if (!sessionUser || !group || sessionUser.id !== group.organizerId) {
        return history.push(`/groups/${groupId}`);
    }

    return (
        <div className='create-event-main-container'>
            <form className='create-event-form' onSubmit={onSubmit}>
                <div className='event-form-name-div'>
                    <h1>Create an event for {group.name}</h1>
                    <label className='event-name-label'>
                        <h3>What is the name of your event?</h3>
                    {errorsOnSubmit?.name && <p className='group-form-errors'>{errorsOnSubmit.name}</p>}
                        <input
                            type='text'
                            placeholder='Event Name'
                            className='event-form-input'
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </label>
                </div>

                <div className='event-form-type-price-div'>
                <label className='event-type-label'>
                    <h3>Is this an in person or online event?</h3>
                    {errorsOnSubmit?.type && <p className='group-form-errors'>{errorsOnSubmit.type}</p>}
                    <select
                        placeholder='(select one)'
                        value={type}
                        className='event-form-select'
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="" disabled hidden>
                            (Select One)
                        </option>
                        <option value='Online'>Online</option>
                        <option value='In person'>In person</option>
                    </select>
                </label>
                <label className='event-visibility-label'>
                    <h3>Is this event private or public?</h3>
                    {errorsOnSubmit?.visibility && <p className='group-form-errors'>{errorsOnSubmit.visibility}</p>}
                    <select
                        placeholder='(select one)'
                        value={visibility}
                        className='event-form-select'
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="" disabled hidden>
                            (Select One)
                        </option>
                        <option value='Private'>Private</option>
                        <option value='Public'>Public</option>
                    </select>
                </label>
                <label className='event-price-label'>
                    <h3>What is the price for your event?</h3>
                    {errorsOnSubmit?.price && <p className='group-form-errors'>{errorsOnSubmit.price}</p>}
                    <input
                        type='number'
                        step='.01'
                        placeholder='0'
                        value={price}
                        className='event-form-input'
                        onChange={(e) => setPrice(e.target.value)}
                    ></input>
                </label>
                </div>

               <div className='event-form-date-div'>
               <label className='event-startDate-label'>
                    <h3>When does your event start?</h3>
                    {errorsOnSubmit?.startDate && <p className='group-form-errors'>{errorsOnSubmit.startDate}</p>}
                    <input
                        type='datetime-local'
                        step='900'
                        placeholder='MM/DD/YYYY HH:mm AM'
                        value={startDate}
                        className='event-form-input'
                        onChange={(e) => setStartDate(e.target.value)}
                        onClick={(e) => setStartDate(e.target.value)}
                    ></input>
                </label>
                <label className='event-endDate-label'>
                    <h3>When does your event end?</h3>
                    {errorsOnSubmit?.endDate && <p className='group-form-errors'>{errorsOnSubmit.endDate}</p>}
                    <input
                        type='datetime-local'
                        step='900'
                        placeholder='MM/DD/YYYY HH:mm AM'
                        value={endDate}
                        className='event-form-input'
                        onChange={(e) => setEndDate(e.target.value)}
                        onClick={(e) => setEndDate(e.target.value)}
                    ></input>
                </label>
               </div>

                <div className='event-form-url-div'>
                <label className='event-url-label'>
                    <h3>Please add in image url for your event below:</h3>
                    {errorsOnSubmit?.url && <p className='group-form-errors'>{errorsOnSubmit.url}</p>}
                    <input
                        type='text'
                        placeholder='Image Url'
                        value={url}
                        className='event-form-input'
                        onChange={(e) => setUrl(e.target.value)}
                    ></input>
                </label>
                </div>

                <div className='event-form-description-div'>
                <label className='event-description-label'>
                    <h3>Please describe your event:</h3>
                    {errorsOnSubmit?.description && <p className='group-form-errors'>{errorsOnSubmit.description}</p>}
                    <textarea
                        rows='10'
                        cols='50'
                        placeholder='Please write at least 50 characters'
                        value={description}
                        className='event-form-input textbox'
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </label>
                </div>

                <div className='event-form-submit-button'>
                    <button type='submit'>Create Event</button>
                </div>
            </form>
        </div>
    )
}

export default CreateEventForm;
