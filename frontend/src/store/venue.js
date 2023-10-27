import { csrfFetch } from "./csrf";
import { getAllGroupsThunk } from "./groups";

export const postOneVenueThunk = (groupId, venueReqBody) => async dispatch => {
    // console.log(payload)
    const response = await csrfFetch (`/api/groups/${groupId}/venues`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(venueReqBody)
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(getAllGroupsThunk())
    return data
  } else {
    const errors = await response.json()
    return errors
  }
}
