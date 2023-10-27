import { csrfFetch } from "./csrf";
import singleGroupReducer from "./single-group";

const GET_ONE_EVENT = 'events/getoneevent'

const getOneEvent = (event) => {
    return {
        type: GET_ONE_EVENT,
        event
    }
}

export const getOneEventThunk = (eventId) => async (dispatch) => {

    const response = await csrfFetch(`/api/events/${eventId}`)

    if (response.ok) {
        const event = await response.json()

        dispatch(getOneEvent(event))
        return event
    } else {
        const errorData = response.json()
        console.error('Error', errorData)
    }
}

const singleEventReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ONE_EVENT: {
            const newState = {...action.event}
            return newState
        }
        default:
            return state
    }
}

export default singleEventReducer;
