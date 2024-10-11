import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommentForm from "../forms/CommentForm.js";
import NewQueueForm from "../forms/NewQueueForm.js";

function TicketDisplay() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showQueueForm, setShowQueueForm] = useState(false);
    const [queues, setQueues] = useState([]);
    const [ticket, setTicket] = useState(location.state.ticket);
    const [comments, setComments] = useState(ticket.comments);
    const user = location.state.user;

    useEffect(() => {
        fetch(`/ticket/${ticket.id}`)
            .then(response => response.json())
            .then(data => {
                setTicket(data);
                setComments(data.comments);
                setQueues(data.queues);
            });
    }, [ticket.id, showCommentForm, showQueueForm]);

    function deleteTicket() {
        fetch(`/ticket/${ticket.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            if (response.ok) { navigate("/home"); }
        });
    }

    function deleteQueue(queueId) {
        fetch(`/ticket/${ticket.id}/queue/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: queueId }),
        }).then((response) => {
            if (response.ok) {
                setQueues(queues.filter(queue => queue.id !== queueId));
            }
        });
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
                            <button className="button ticket-action"
                                    onClick={() => navigate(`/modify_ticket/${ticket.id}`, { state: { ticket, user } })}>Update</button>
                            <button className="button ticket-action"
                                    onClick={() => deleteTicket()}>Delete</button>
                            <div className="ticket-details-extra">
                                <p><strong>Ticket ID:</strong> {ticket.id}</p>
                                <p><strong>Date:</strong> {ticket.date}</p>
                            </div>
                        </div>
                        <div className="ticket-section">
                            <h2>Queues</h2>
                            <div className="queues-container">
                                {queues.map(queue => (
                                    <div key={queue.id} className="queue-bubble">
                                        {queue.name}
                                        {user.role !== 'client' && (
                                            <button className="button delete-queue"
                                                    onClick={() => deleteQueue(queue.id)}>Delete</button>
                                        )}
                                    </div>
                                ))}
                                {user.role !== 'client' && (
                                    <div className="queue-bubble add-queue-bubble"
                                         onClick={() => setShowQueueForm(!showQueueForm)}>Add queue</div>
                                )}
                            </div>
                            {showQueueForm && user.role !== 'client' && (
                                <NewQueueForm onClose={() => setShowQueueForm(false)} ticket={ticket} />
                            )}
                        </div>
                        <div className="ticket-section">
                            <h2>Tags</h2>
                            <p>tags</p>
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
                                {showCommentForm && (<CommentForm onClose={() => { setShowCommentForm(false); }} ticket={ticket} />)}
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