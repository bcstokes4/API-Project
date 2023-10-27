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
export const postOneEventImage = (eventId, requestBody) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
    })

    if(response.ok){
        const data = await response.json()
        dispatch(getAllEventsThunk())
        return data
      }
      else {
        const errors = await response.json()
        return errors
      }
}
// DELETE EVENT THUNK
export const deleteOneEventThunk = (eventId) => async (dispatch) => {
    try{
        const response = await csrfFetch(`/api/events/${eventId}`, {
            method: 'DELETE'
          })
          if (response.ok) {
            const data = await response.json()
            dispatch(getAllEventsThunk())

            return data
        }
    }
    catch(e) {
        console.error(e)
    }
}

export const postOneEventThunk = (groupId, requestBody) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
      })

      if(response.ok){
        const data = await response.json()
        dispatch(getAllEventsThunk())
        return data
      }

      else {
        const errors = await response.json()
        return errors
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
