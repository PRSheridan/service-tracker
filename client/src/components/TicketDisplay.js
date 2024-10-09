import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import CommentForm from "../forms/CommentForm.js"

function TicketDisplay() {
    const navigate = useNavigate()
    const location = useLocation()
    const ticket = location.state.ticket
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [comments, setComments] = useState(ticket.comments);

    useEffect(() => {
        fetch(`/tickets/${ticket.id}/comments`)
            .then(response => response.json())
            .then(data => setComments(data));
    }, [showCommentForm]);

    function deleteTicket() {
        fetch(`/ticket/${ticket.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type':'application/json' }
        }).then((response) => {
            if (response.ok) { navigate("/home" ) }
        })
    }

    return (
        <div className="ticket-container">
            <div className="ticket-details">
                <div className="ticket-header">
                    <h1>{ticket.title}</h1>
                    <div className={`ticket-status`}>{ticket.status}</div>
                </div>
                <div className="ticket-content">
                    <div className="ticket-main">
                        <div className="ticket-section">
                            <p><strong>Ticket ID:</strong> {ticket.id}</p>
                            <p><strong>Date:</strong> {ticket.date}</p>
                            <button className="button ticket-action">Update</button>
                            <button className="button ticket-action" onClick={() => deleteTicket()}>Delete</button>
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
                                <button className="button add-comment" onClick={() => setShowCommentForm(!showCommentForm)}>New comment</button>
                            </div>
                            <div className="comment-section">
                                {showCommentForm ? <CommentForm onClose={() => { setShowCommentForm(false); }} ticket={ticket} /> : <></>}
                                {comments.length > 0 ? (
                                    comments
                                        .slice()
                                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                                        .map((comment) => (
                                            <div key={comment.id} className="comment">
                                                <div className="comment-header">
                                                    <span className="username">{comment.user.username}</span>
                                                    <span className="date">{comment.date}</span>
                                                </div>
                                                <div className="comment-content">{comment.content}</div>
                                            </div>
                                        ))
                                ) : (
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
            </div>
        </div>
    );
}

export default TicketDisplay;