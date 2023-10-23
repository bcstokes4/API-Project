import './SingleGroupListItem.css'

function SingleGroupListItem({group}) {
    return (
        <div className='grouplist-item-container'>
            <img src={group.previewImage}/>
            <div className='grouplist-item-text-container'>
            <h2>{group.name}</h2>
            <h3>{group.city}, {group.state}</h3>
            <p>{group.about}</p>
            <span>## Events</span> <span> {group.private ? 'private': 'public'}</span>
            </div>
        </div>
    )
}



export default SingleGroupListItem;
