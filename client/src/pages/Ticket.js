import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Ticket() {
    const location = useLocation()
    const ticket = location.state.ticket

    return (
        <div className="ticket-details">
            <div className="ticket-header">
                <h1>{ticket.title}</h1>
                <div className="ticket-status">{ticket.status}</div>
            </div>
            <div className="ticket-section">
                <h2>Ticket Details</h2>
                <p><strong>Ticket ID:</strong> {ticket.id}</p>
                <p><strong>Date:</strong> {ticket.date}</p>
                <p><strong>Requestor:</strong> {ticket.requestor.username}</p>
                <p><strong>Email:</strong> {ticket.email}</p>
                <p><strong>Phone:</strong> {ticket.phone}</p>

            </div>
            <div className="ticket-section">
                <h2>Actions</h2>
            </div>
            <div className="ticket-section">
                <h2>Priority</h2>
                <p>{ticket.priority}</p>
            </div>
            <div className="ticket-section">
                <h2>Description</h2>
                <p>{ticket.description}</p>
            </div>
            <div className="ticket-section">
                <h2>Comments</h2>
                <p>{ticket.comments}</p>
            </div>
            <div className="ticket-section">
                <h2>Images</h2>
                <p>{ticket.images}</p>
            </div>
        </div>
    );
}


export default Ticket;