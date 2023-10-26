import './CreateGroupForm.css'
import GroupForm from '../GroupForm'
import { useSelector } from "react-redux";

function CreateGroupForm() {
    const sessionUser = useSelector((state) => state.session.user);

  if (!sessionUser) {
    return (
        <h1>YOU CAN'T BE HERE SILLY GOOSE</h1>
    )
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
