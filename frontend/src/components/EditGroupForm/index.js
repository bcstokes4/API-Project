import GroupForm from "../GroupForm";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { getOneGroupThunk } from '../../store/single-group';
import {getAllGroupsThunk} from '../../store/groups.js'
import './EditGroupForm.css'

function EditGroupForm() {
    const { groupId } = useParams();
    const dispatch = useDispatch()
    const history = useHistory()

    const sessionUser = useSelector((state) => state.session.user);
    const groupObj = useSelector((state) => state.groups);
    const group = groupObj[groupId];
    // const group = useSelector(state => state.singeGroup)


    useEffect(() => {
        const initialFetch = async() => {
            try{
                await dispatch(getAllGroupsThunk())
                await dispatch(getOneGroupThunk(groupId))
            }
            catch(error) {
                history.push('/groups')
              }
            }
            initialFetch()
    }, [dispatch, groupId])


    if (!group) return null;
    if (!sessionUser || group.organizerId !== sessionUser.id) {
        return history.push('/groups')
      }
    group.location = group.city + ',' + group.state
    group.visibility = group.private ? 'Private' : 'Public'

    return (
        <div className="edit-group-form-main-container">
            <h3>UPDATE YOUR GROUP'S INFORMATION</h3>
            <h2>We'll walk you through a few steps to update your group's information</h2>
            <GroupForm formAction='edit' group={group}/>
        </div>
    )
}

export default EditGroupForm;
