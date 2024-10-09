import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QueueDisplay({ queue }) {
    const navigate = useNavigate();

    return (
        <div className="ticket-list">
            <div className="queue-display-name">{queue.name} queue</div>
            <div className="queue-display-header">
                <div className="ticket-column">Ticket ID</div>
                <div className="ticket-column">Title</div>
                <div className="ticket-column">Requestor</div>
                <div className="ticket-column">Status</div>
                <div className="ticket-column">Date</div>
            </div>
            {queue.tickets.length > 0 ? (queue.tickets
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((ticket) => (
                <div key={ticket.id} className="ticket-row"
                        onClick={() => navigate(`/ticket/${ticket.id}`, {state: {ticket: ticket}})}>
                    <div className="ticket-cell">{ticket.id}</div>
                    <div className="ticket-cell">{ticket.title}</div>
                    <div className="ticket-cell">{ticket.requestor.username}</div>
                    <div className="ticket-cell">{ticket.status}</div>
                    <div className="ticket-cell">{ticket.date}</div>
                </div>
                ))
            ) : (
                <>No tickets to display</>
            )}
        </div>
    );
}

export default QueueDisplay;