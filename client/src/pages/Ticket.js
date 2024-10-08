import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import CommentForm from "../forms/CommentForm.js"

function Ticket() {
    const location = useLocation()
    const ticket = location.state.ticket

    const [showCommentForm, setShowCommentForm] = useState(false)

    return (
        <div className="ticket-container">
            <div className="ticket-details">
                <div className="ticket-header">
                    <h1>{ticket.title}</h1>
                    <div className="ticket-status">{ticket.status}</div>
                </div>
                <div className="ticket-section">
                    <h2>Ticket Details</h2>
                    <p><strong>Ticket ID:</strong> {ticket.id}</p>
                    <p><strong>Date:</strong> {ticket.date}</p>
                </div>
                <div className="ticket-section">
                    <h2>Actions</h2>
                    <button className="button ticket-action">Update</button>
                    <button className="button ticket-action">Delete</button>
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
                    <div className="comments-header">
                        <h2>Comments</h2>
                        <button className="button add-comment"
                                onClick={() => setShowCommentForm(!showCommentForm)}>New comment</button>
                    </div>
                    <div className="comment-section">
                    {showCommentForm ? <CommentForm onClose={() => { setShowCommentForm(false) }}
                                            ticket={ticket}/> : <></>}
                        { ticket.comments.length > 0 ? ( ticket.comments.map((comment) => (
                            <div key={comment.date} className="comment">
                                <div class="comment-header">
                                    <span class="username">{ comment.user.username }</span>
                                    <span class="date">{ comment.date }</span>
                                </div>
                                <div class="comment-content">{ comment.content }</div>
                            </div>
                        ))) : (
                            <>No comments to display</>
                        )}
                    </div>
                </div>
            </div>
            <div className="sidebar">
                <div className="requestor-info">
                    <h2>Requestor Information</h2>
                    <p><strong>Requestor:</strong> {ticket.requestor.username}</p>
                    <p><strong>Email:</strong> {ticket.email}</p>
                    <p><strong>Phone:</strong> {ticket.phone}</p>
                </div>
                <div className="ticket-section">
                    <h2>Images</h2>
                    <p>{ticket.images}</p>
                </div>
            </div>
        </div>
    );
}


export default Ticket;