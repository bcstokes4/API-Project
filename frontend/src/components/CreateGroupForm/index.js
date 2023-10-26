import './CreateGroupForm.css'
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { postOneGroupThunk } from '../../store/single-group';
import { postOneGroupPictureThunk } from '../../store/single-group';
import {useDispatch, useSelector} from 'react-redux'

function CreateGroupForm() {
    let history = useHistory()
    let dispatch = useDispatch()


    const [location, setLocation] = useState('')
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [about, setAbout] = useState('')
    const [visibility, setVisibility] = useState('')
    const [url, setUrl] = useState('')
    const [errors, setErrors] = useState({})
    const [errorsOnSubmit, setErrorsOnSubmit] = useState({})

    let locationParts = location.split(',')
    let state = locationParts[1]
    let city = locationParts[0]

    // console.log('location', location)
    // console.log('name', name )
    // console.log('type', type)
    // console.log('about', about)
    // console.log('visibility', visibility)
    // console.log('url', url)

    // FOR USE LATER WHEN CHECKING URL TYPE!
    // let urlParts = url.split('.')
    // let urlEnding = url[1]
    // console.log(urlEnding)

    useEffect( () => {
        let errorsObj = {}
        if(name.length < 2 || name.length > 60) {
            errorsObj.name = 'Name must be 60 characters or less'
        }
        if(!name.length){
            errorsObj.name = 'Name is required'
        }
        if((state?.length !== 2 && state?.length !== 3) || city?.length < 1) {
            errorsObj.location = 'Location must be in the format city, state (New York, NY)'
        }

        if(!about.length) {
            errorsObj.about = 'Description is required'
        }
        if(about.length < 50) {
            errorsObj.about = 'About must be 50 characters or more'
        }

        if(!location.length){
            errorsObj.location = 'Location is required'
        }


        if(type !== 'Online' && type != 'In person'){
            errorsObj.type = 'Group Type is required'
        }
        if(visibility !== 'Private' && visibility !== 'Public'){
            errorsObj.visibility = 'Visibility Type is required'
        }

        if(!url.includes(".png") && !url.includes(".jpg") && !url.includes(".jpeg")){
            errorsObj.url = 'url must be jpg, jpeg or png'
        }

        setErrors(errorsObj)
    }, [name.length, about.length, location.length, type, visibility])


    const onSubmit = async (e) => {
        e.preventDefault()

        const requestBodyGroup = {
              name,
              about,
              type,
              "private": visibility === 'Private',
              city,
              state
        }

        if(!Object.values(errors).length){

            try {
                let res = await dispatch(postOneGroupThunk(requestBodyGroup))
            const requestBodyImage = {url, "preview": true}

            await dispatch(postOneGroupPictureThunk(res.id, requestBodyImage))
            setLocation('')
            setName('')
            setType('')
            setAbout('')
            setVisibility('')
            setUrl('')
            setErrors({})
            setErrorsOnSubmit({})
            history.push(`/groups/${res.id}`)
            }

            catch(e) {
                const errors = await e.json()
                setErrors(errors.errors)
            }
        }


        setErrorsOnSubmit({...errors})


      }



    return (
        <div className='group-form-main-container'>
            <h3>BECOME AN ORGANIZER</h3>
            <h2>We'll walk you through a few steps to build your local community</h2>
            <form className='create-group-form'
            onSubmit={onSubmit}
            >
                <label>
                    <h3>First, set your group's location.</h3>
                    <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
                    <input type='text'
                    className='group-form-location-input'
                    placeholder='City, STATE'
                    value={location}
                    onChange={ e => setLocation(e.target.value)}
                    />
                </label>
                {errorsOnSubmit?.location && <p className='group-form-errors'>{errorsOnSubmit.location}</p>}
                <label>
                    <h3>What will your group's name be?</h3>
                    <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                    type='text'
                    className='group-form-name-input'
                    placeholder='What is your group name?'
                    value={name}
                    onChange={ (e) => setName(e.target.value)}
                    />
                </label>
                {errorsOnSubmit?.name && <p className='group-form-errors'>{errorsOnSubmit.name}</p>}
                <label>
                    <h3>Now describe what your group will be about</h3>
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <textarea
                    rows='10'
                    cols='50'
                    placeholder='Please write at least 50 characters'
                    value={about}
                    onChange={ (e) => setAbout(e.target.value)}
                    ></textarea>
                </label>
                {errorsOnSubmit?.about && <p className='group-form-errors'>{errorsOnSubmit.about}</p>}
                <label>
                    <h3>Final Steps...</h3>
                    <p>Is this an in person or online group?</p>
                    <select
                    placeholder='(select one)'
                    value={type}
                    onChange={ (e) => setType(e.target.value)}
                    >
                        <option value="" disabled hidden>
                        (Select One)
                        </option>
                        <option value='Online'>Online</option>
                        <option value='In person'>In person</option>
                    </select>
                    {errorsOnSubmit?.type && <p className='group-form-errors'>{errorsOnSubmit.type}</p>}
                    <p>Is this group private or public?</p>
                    <select
                    placeholder='(select one)'
                    value={visibility}
                    onChange={ (e) => setVisibility(e.target.value)}
                    >
                        <option value="" disabled hidden>
                        (Select One)
                        </option>
                        <option value='Private'>Private</option>
                        <option value='Public'>Public</option>
                    </select>
                    {errorsOnSubmit?.visibility && <p className='group-form-errors'>{errorsOnSubmit.visibility}</p>}
                    <p>Please add an image url for your group below:</p>
                    <input
                    type='text'
                    placeholder='Image Url'
                    value={url}
                    onChange={ (e) => setUrl(e.target.value)}
                    />
                </label>
                {errorsOnSubmit?.url && <p className='group-form-errors'>{errorsOnSubmit.url}</p>}
                <label>
                <button
                type='submit'
                >
                Create Group
                </button>
                </label>
            </form>
        </div>
    )
}



export default CreateGroupForm;
