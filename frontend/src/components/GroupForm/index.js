import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { postOneGroupThunk } from '../../store/single-group';
import { postOneGroupPictureThunk } from '../../store/single-group';
import {useDispatch, useSelector} from 'react-redux'
import { editOneGroupThunk } from "../../store/single-group";
import { postOneVenueThunk } from "../../store/venue";

function GroupForm({group, formAction}) {
    let user = useSelector(state => state.session.user)
    let history = useHistory()
    let dispatch = useDispatch()

    // const [location, setLocation] = useState(
    //     formAction === "edit" ? group.location : ""
    //   )
    const [name, setName] = useState(
        formAction === "edit" ? group.name : ""
      )
    const [type, setType] = useState(
        formAction === "edit" ? group.type : ""
      )
    const [about, setAbout] = useState(
        formAction === "edit" ? group.about : ""
      )
    const [visibility, setVisibility] = useState(
        formAction === "edit" ? group.visibility : ""
      )

    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [url, setUrl] = useState('')
    const [errors, setErrors] = useState({})
    const [errorsOnSubmit, setErrorsOnSubmit] = useState({})

    //CHECK IF LOGGED IN
    if(!user) {
        return (
            <h1>YOU CANT BE HERE SILLY GOOSE</h1>
        )
    }

    const resetVariables = () => {
            setCity('')
            setState('')
            setName('')
            setType('')
            setAbout('')
            setVisibility('')
            setUrl('')
            setErrors({})
            setErrorsOnSubmit({})
    }
     function isImgUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
        const lowerCaseUrl = url.toLowerCase();

        return imageExtensions.some(extension => lowerCaseUrl.includes(extension));
    }

    const onSubmit = async (e) => {


        let errorsObj = {}
        if(name.length < 2 || name.length > 60) {
            errorsObj.name = 'Name must be 60 characters or less'
        }
        if(!name.length){
            errorsObj.name = 'Name is required'
        }
        if(!about.length) {
            errorsObj.about = 'Description is required'
        }
        if(about.length < 50) {
            errorsObj.about = 'About must be 50 characters or more'
        }

        if(!city.length || !state){
            errorsObj.location = 'Location is required'
        }
        if(type !== 'Online' && type != 'In person'){
            errorsObj.type = 'Group Type is required'
        }
        if(visibility !== 'Private' && visibility !== 'Public'){
            errorsObj.visibility = 'Visibility Type is required'
        }
        if(!isImgUrl(url)){
            errorsObj.url = 'url must be jpg, jpeg or png'
        }

        setErrors(errorsObj)



        e.preventDefault()

        const requestBodyGroup = {
              name,
              about,
              type,
              "private": visibility === 'Private',
              city,
              state
        }

        // Check for errors
    if (Object.keys(errorsObj).length > 0) {
        setErrorsOnSubmit({ ...errorsObj });
    } else {
        setErrorsOnSubmit({});
    }

        if(!Object.values(errorsObj).length){

            if(formAction === 'edit'){
                try{
                    const res = await dispatch(editOneGroupThunk(group.id, requestBodyGroup))
                    history.push(`/groups/${res.id}`)
                }
                catch(e) {
                    const errors = await e.json()
                    setErrors(errors.errors)
                    // console.error(errors) for testing in dev
                }
            }
            else {
                try {
                    const res = await dispatch(postOneGroupThunk(requestBodyGroup))
                    const venueReqBody = {
                        groupId: res.id,
                        address: '123 Demo Street',
                        city,
                        state,
                        lat: 5,
                        lng: -5
                    }
                    await dispatch(postOneVenueThunk(res.id, venueReqBody))
                    const requestBodyImage = {url, "preview": true}

                    await dispatch(postOneGroupPictureThunk(res.id, requestBodyImage))
                    resetVariables()
                    history.push(`/groups/${res.id}`)
                }
                catch(e) {
                    const errors = await e.json()
                    setErrors(errors.errors)
                    // console.error(errors) for testing in dev
                }
            }
        }





      }



    return (

            <form className='create-group-form'
            onSubmit={onSubmit}
            >
                <label>
                    <h3>First, set your group's location.</h3>
                    <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
                    <input type='text'
                    className='group-form-location-input'
                    placeholder='City'
                    value={city}
                    onChange={ e => setCity(e.target.value)}
                    />
                </label>
                <select
            type="text"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              if (!e.target.value) errors.state = "State is required";
              else {
                errors.state = null;
              }
            }}
            placeholder="State"
          >
            <option value="" disabled hidden>
              State
            </option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
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
                    {formAction !== 'edit' && (
                    <div>
                        <p>Please add an image url for your group below:</p>
                    <input
                    type='text'
                    placeholder='Image Url'
                    value={url}
                    onChange={ (e) => setUrl(e.target.value)}
                    />
                    </div>
                    )}
                </label>
                {errorsOnSubmit?.url && <p className='group-form-errors'>{errorsOnSubmit.url}</p>}
                <label>
                <button
                type='submit'
                >
                {formAction !== 'edit' ? 'Create Group' : 'Update Group'}
                </button>
                </label>
            </form>

    )
}




export default GroupForm;
