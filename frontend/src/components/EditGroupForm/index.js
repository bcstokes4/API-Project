import CreateGroupForm from "../CreateGroupForm";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function EditGroupForm() {
    // const { groupId } = useParams();

    // const sessionUser = useSelector((state) => state.session.user);

    return (
        <div>
            <h1>hellooooooooo</h1>
            <CreateGroupForm/>
        </div>
    )
}

export default EditGroupForm;
