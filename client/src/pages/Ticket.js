import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import CommentForm from "../forms/CommentForm.js"
import QueueForm from "../forms/QueueForm.js"
import TagForm from "../forms/TagForm.js"

function Ticket() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, ticket: initialTicket } = location.state

  const [ticket, setTicket] = useState(initialTicket)
  const [comments, setComments] = useState(initialTicket.comments)
  const [queues, setQueues] = useState([])
  const [tags, setTags] = useState([])
  const [images, setImages] = useState([])
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [showQueueForm, setShowQueueForm] = useState(false)
  const [showTagForm, setShowTagForm] = useState(false)

  useEffect(() => {
    fetch(`/ticket/${ticket.id}`)
      .then(response => response.json())
      .then(data => {
        setTicket(data)
        setComments(data.comments)
        setQueues(data.queues)
        setTags(data.tags)
        setImages(data.images) // Set images here
      })
  }, [ticket.id, showCommentForm, showQueueForm, showTagForm])

  function handleImageUpload(e) {
    e.preventDefault()
    const formData = new FormData()
    const fileInput = e.target.elements.fileInput
  
    if (fileInput.files.length === 0) {
      console.error("No file selected")
      return
    }
  
    formData.append("image", fileInput.files[0])
    formData.append("ticket_id", ticket.id) // Send ticket number

    console.log(formData)
  
    fetch('/image', {
      method: "POST",
      body: formData
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    }).then(data => {
      // Refresh the data without reloading the page
      fetch(`/ticket/${ticket.id}`)
        .then(res => res.json())
        .then(data => {
          setImages(data.images) // Update images from the fetched data
        })
    }).catch(error => {
      console.error("Error uploading image:", error)
    })
  }

  function deleteTicket() {
    fetch(`/ticket/${ticket.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      if (response.ok) {
        navigate("/home")
      }
    })
  }

  function deleteQueue(queueID) {
    fetch(`/ticket/${ticket.id}/queue/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(queueID)
    }).then((response) => {
      if (response.ok) {
        setQueues(queues.filter((queue) => queue.id !== queueID))
      }
    })
  }

  function deleteTag(tagID) {
    fetch(`/ticket/${ticket.id}/tag/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tagID)
    }).then((response) => {
      if (response.ok) {
        setTags(tags.filter((tag) => tag.id !== tagID))
      }
    })
  }

  function renderQueues() {
    return (
      <>
        {queues.map(queue => (
          <div key={queue.id} className="queue-bubble">
            {queue.name}
            {user.role !== 'client' && (
              <button className="button delete-queue" onClick={() => deleteQueue(queue.id)}>Delete</button>
            )}
          </div>
        ))}
        {user.role !== 'client' && (
          <div className="queue-bubble add-queue-bubble" onClick={() => setShowQueueForm(!showQueueForm)}>
            Add queue
          </div>
        )}
      </>
    )
  }

  function renderTags() {
    return (
      <>
        {tags.map(tag => (
          <div key={tag.id} className="tag-bubble">
            {tag.name}
            {user.role !== 'client' && (
              <button className="button delete-tag" onClick={() => deleteTag(tag.id)}>Delete</button>
            )}
          </div>
        ))}
        {user.role !== 'client' && (
          <div className="tag-bubble add-tag-bubble" onClick={() => setShowTagForm(!showTagForm)}>
            Add tag
          </div>
        )}
      </>
    )
  }

  function renderComments() {
    if (comments.length === 0) {
      return <div>No comments to display</div>
    }

    return comments
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
  }

  return (
    <div className="ticket-container">
      <div className="ticket-details">
        <div className="ticket-header">
          <h1>{ticket.title}</h1>
          <div className="ticket-status">{ticket.status}</div>
        </div>
        <div className="ticket-content">
          <div className="ticket-main">
            <div className="ticket-section">
              <button className="button ticket-action"
                      onClick={() => navigate(`/modify_ticket/${ticket.id}`, { state: { ticket, user } })}>Update</button>
              <button className="button ticket-action"
                      onClick={deleteTicket}>Delete</button>
              <div className="ticket-details-extra">
                <p><strong>Ticket ID:</strong> {ticket.id}</p>
                <p><strong>Date:</strong> {ticket.date}</p>
              </div>
            </div>

            {/* Queues Section */}
            <div className="ticket-section">
              <h2>Queues</h2>
              <div className="queues-container">
                {renderQueues()}
              </div>
              {showQueueForm && user.role !== 'client' && (
                <QueueForm onClose={() => setShowQueueForm(false)} ticket={ticket} />
              )}
            </div>

            {/* Tags Section */}
            <div className="ticket-section">
              <h2>Tags</h2>
              <div className="tags-container">
                {renderTags()}
              </div>
              {showTagForm && user.role !== 'client' && (
                <TagForm onClose={() => setShowTagForm(false)} ticket={ticket} />
              )}
            </div>

            {/* Priority and Description Section */}
            <div className="ticket-section">
              <h2>Priority</h2>
              <p>{ticket.priority}</p>
            </div>
            <div className="ticket-section">
              <h2>Description</h2>
              <p>{ticket.description}</p>
            </div>

            {/* Comment Section */}
            <div className="ticket-section">
              <div className="comments-header">
                <h2>Comments</h2>
                <button className="button add-comment"
                        onClick={() => setShowCommentForm(!showCommentForm)}>New comment</button>
              </div>
              <div className="comment-section">
                {showCommentForm && (<CommentForm onClose={() => { setShowCommentForm(false) }} ticket={ticket} />)}
                {renderComments()}
              </div>
            </div>
          </div>

          {/* Ticket Sidebar */}
          <div className="sidebar">
            <div className="requestor-info">
              <h2>Requestor Information</h2>
              <p><strong>Requestor:</strong> {ticket.requestor.username}</p>
              <p><strong>Email:</strong> {ticket.email}</p>
              <p><strong>Phone:</strong> {ticket.phone}</p>
            </div>
            <div className="ticket-section">
              <h2>Images</h2>
              <form onSubmit={handleImageUpload}>
                <div>
                  <input type="file" name="fileInput" accept="image/*" />
                </div>
                <button type="submit">Add image</button>
              </form>
              <div className="images-container">
                {images.map(image => (
                  <img key={image.id} src={image.file_path} alt="Ticket" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticket



  
