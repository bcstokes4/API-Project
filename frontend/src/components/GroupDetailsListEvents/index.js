import './GroupDetailsListEvents.css'

function GroupDetailsListEvents({ events, groupId }) {

    let eventsForGroup = events.filter(event => event.groupId == groupId)

    //FOR COMPARING DATES
    let futureEvents = []
    let pastEvents = []

    let currentDay = new Date().getDate()
    let currentMonth = new Date().getMonth()
    let currentYear = new Date().getFullYear()
    let currentDate = `${currentYear}-${currentMonth + 1}-${currentDay}`

    for (let i = 0; i < eventsForGroup.length; i++) {
        const event = eventsForGroup[i];
        let eventDate = event.startDate.slice(0, 10)

        if (eventDate >= currentDate) {
            futureEvents.push(event)
        }
        else pastEvents.push(event)
    }
    futureEvents.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
    pastEvents.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA;
      });


    return (
        <div className="group-details-event-list-main-container">
            <h2 className='upcoming-event-heading'>Upcoming Events ({futureEvents.length})</h2>
            {futureEvents.map(event => {
                let startDate = event.startDate.slice(0, 10)
                let hours = new Date(event.startDate).getHours()
                let minutes = new Date(event.startDate).getMinutes()
                let startTime = `${hours}:${minutes}:00`

                return <div className="group-details-future-event-div">
                    <div className="group-details-future-event-top-half">
                        <img src={event.previewImage} />
                        <div className="group-details-future-event-inner-text">
                            <h3>{startDate} {startTime}</h3>
                            <h3>{event.name}</h3>
                            {event.venueId ? <h3>{event.Venue.city}, {event.Venue.state}</h3>: <h3>Online</h3>}
                        </div>
                    </div>
                    <p>{event.description}</p>
                </div>
            })
            }
    <h2 className='past-event-heading'>Past Events ({pastEvents.length})</h2>
            {pastEvents.map(event => {

                let startDate = event.startDate.slice(0, 10)
                let hours = new Date(event.startDate).getHours()
                let minutes = new Date(event.startDate).getMinutes()
                let startTime = `${hours}:${minutes}:00`

                return <div className="group-details-past-event-div">
                    <div className="group-details-past-event-top-half">
                        <img src={event.previewImage} />
                        <div className="group-details-past-event-inner-text">
                            <h3>{startDate} {startTime}</h3>
                            <h3>{event.name}</h3>
                            {event.venueId ? <h3>{event.Venue.city}, {event.Venue.state}</h3>: <h3>Online</h3>}
                        </div>
                    </div>
                    <p>{event.description}</p>
                </div>
            })
            }
        </div>
    )
}

export default GroupDetailsListEvents;
