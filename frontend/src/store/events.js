import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = 'groups/getallevents'

const getAllEvents = (events) => {
    return {
        type: GET_ALL_EVENTS,
        events
    }
}

export const getAllEventsThunk = () => async (dispatch) => {

    const response = await csrfFetch('/api/events')

    if (response.ok) {
        const events = await response.json()
        dispatch(getAllEvents(events))
        return events
    }
}

const eventsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_EVENTS: {
            const newState = {}
            action.events.Events.forEach( (event) => {
                newState[event.id] = event
            })
            return newState
        }
        default:
            return state
    }
}

export default eventsReducer;
