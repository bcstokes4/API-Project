import { csrfFetch } from "./csrf";

const GET_ONE_GROUP = 'groups/getonegroup'

const getOneGroup = (group) => {
    return {
        type: GET_ONE_GROUP,
        group
    }
}

export const getOneGroupThunk = (groupId) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${groupId}`)

    if (response.ok) {
        const group = await response.json()
        dispatch(getOneGroup(group))
        return group
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
