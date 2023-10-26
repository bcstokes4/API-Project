import './CreateGroupForm.css'
import GroupForm from '../GroupForm'

function CreateGroupForm() {

    return (
        <div className='group-form-main-container'>
            <h3>BECOME AN ORGANIZER</h3>
            <h2>We'll walk you through a few steps to build your local community</h2>
            <GroupForm formAction='create'/>
        </div>
    )
}

export default CreateGroupForm;
