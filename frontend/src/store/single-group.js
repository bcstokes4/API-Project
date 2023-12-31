import { csrfFetch } from "./csrf";
import { getAllGroupsThunk } from "./groups";
const GET_ONE_GROUP = 'groups/getonegroup'
// const CREATE_GROUP = 'groups/creategroup'
const UPDATE_GROUP = 'groups/updategroup'

const getOneGroup = (group) => {
    return {
        type: GET_ONE_GROUP,
        group
    }
}

const updateGroup= (group) => ({
    type: UPDATE_GROUP,
    group,
  });


//EDIT A GROUP THUNK
export const editOneGroupThunk = (groupId, reqBody) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    })

    if (response.ok) {
        const group = await response.json()

        dispatch(getOneGroupThunk(group.id))
        dispatch(getAllGroupsThunk())
        // console.log('FETCH GROUP EDIT', group)
        return group
    } else {
        const errorData = response.json()
        // console.error('Error', errorData)
    }
}

// POST GROUP
export const postOneGroupThunk = (reqBody) => async (dispatch) => {

    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    })

    if (response.ok) {
        const group = await response.json()

        dispatch(getOneGroupThunk(group.id))
        return group
    } else {
        const errorData = response.json()
        // console.error('Error', errorData)
    }

}
//POST GROUP PICTURE
export const postOneGroupPictureThunk = (groupId, reqBody) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    })
    if (response.ok) {
        const group = await response.json()

        return group
    } else {
        const errorData = response.json()
        // console.error('Error', errorData)
    }
}

//DELETE GROUP THUNK
export const deleteOneGroupThunk = (groupId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            const data = await response.json()
            dispatch(getAllGroupsThunk())

            return data
        }
    }
    catch(e) {
        // console.error(e)
    }
}

export const getOneGroupThunk = (groupId) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${groupId}`)

    if (response.ok) {
        const group = await response.json()
        dispatch(getOneGroup(group))
        return group
    } else {
        const errorData = response.json()
        // console.error('Error', errorData)
    }
}

const singleGroupReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ONE_GROUP: {
            const newState = {...action.group}
            return newState
        }
        default:
            return state
    }
}

export default singleGroupReducer;
