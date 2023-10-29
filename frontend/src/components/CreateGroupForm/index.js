import './CreateGroupForm.css'
import GroupForm from '../GroupForm'
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

function CreateGroupForm() {
    const history = useHistory()
    const sessionUser = useSelector((state) => state.session.user);

  if (!sessionUser) {
    return history.push('/groups')
  }
    return (
        <div className='group-form-main-container'>
            <h3>BECOME AN ORGANIZER</h3>
            <h2>We'll walk you through a few steps to build your local community</h2>
            <GroupForm formAction='create'/>
        </div>
    )
}

export default CreateGroupForm;
