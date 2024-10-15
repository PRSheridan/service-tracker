import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../context"

function QueueDisplay({ userTickets, queue }) {
    const navigate = useNavigate()
    const user = useContext(UserContext)

    const tickets = userTickets || (queue ? queue.tickets : [])

    function renderTickets() {
        if (tickets.length === 0) {
            return <div>No tickets to display</div>
        }

        const sortedTickets = [...tickets].sort((a, b) => new Date(b.date) - new Date(a.date))

        return sortedTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-row"
                 onClick={() => navigate(`/ticket/${ticket.id}`, { state: { ticket, user } })}>
                <div className="ticket-cell">{ticket.id}</div>
                <div className="ticket-cell">{ticket.title}</div>
                <div className="ticket-cell">{ticket.requestor.username}</div>
                <div className="ticket-cell">{ticket.status}</div>
                <div className="ticket-cell">{ticket.date}</div>
            </div>
        ))
    }

    return (
        <div className="ticket-list">
            {queue ? <div className="queue-display-name">{queue.name}</div> : null}
            <div className="queue-display-header">
                <div className="ticket-column">Ticket ID</div>
                <div className="ticket-column">Title</div>
                <div className="ticket-column">Requestor</div>
                <div className="ticket-column">Status</div>
                <div className="ticket-column">Date</div>
            </div>
            {renderTickets()}
        </div>
    )
}

export default QueueDisplay
