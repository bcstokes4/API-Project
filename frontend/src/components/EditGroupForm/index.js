import GroupForm from "../GroupForm";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { getOneGroupThunk } from '../../store/single-group';
import {getAllGroupsThunk} from '../../store/groups.js'
function EditGroupForm() {
    const { groupId } = useParams();
    const dispatch = useDispatch()

    const groupObj = useSelector((state) => state.groups);
    const group = groupObj[groupId];



    useEffect(() => {
        dispatch(getAllGroupsThunk())
    }, [dispatch, groupId])

    console.log(group)

    if (!group) return null;
    
    group.location = group.city + ',' + group.state
    group.visibility = group.private ? 'Private' : 'Public'

    return (
        <div>
            <h3>UPDATE YOUR GROUP'S INFORMATION</h3>
            <h2>We'll walk you through a few steps to update your group's information</h2>
            <GroupForm formAction='edit' group={group}/>
        </div>
    )
}

export default EditGroupForm;
