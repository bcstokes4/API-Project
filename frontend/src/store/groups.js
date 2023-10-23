import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getallgroups'

const getAllGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
    }
}

export const getAllGroupsThunk = () => async (dispatch) => {

    const response = await csrfFetch('/api/groups')

    if (response.ok) {
        const groups = await response.json()
        dispatch(getAllGroups(groups))
        return groups
    }
}

const groupsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newState = {}
            action.groups.Groups.forEach( (group) => {
                newState[group.id] = group
            })
            return newState
        }
        default:
            return state
    }
}

export default groupsReducer;
