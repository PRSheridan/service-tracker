import React, { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import QueueForm from "../forms/QueueForm"

function Profile() {
  const navigate = useNavigate()
  const { user, setUser } = useOutletContext()
  const [showQueueForm, setShowQueueForm] = useState(false)

  useEffect(() => {
    fetch(`/user/${user.id}`)
      .then((response) => {
        if (response.ok) {
          response.json().then((updated_user) => setUser(updated_user))
        }
      })
  }, [showQueueForm])

  function deleteQueue(queue_id) {
    fetch(`/user/queue/${queue_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      if (response.ok) {
        fetch("/user")
          .then((response) => {
            if (response.ok) {
              response.json().then((updated_user) => setUser(updated_user))
            }
          })
      }
    })
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="header-top">
          <h1 className="title">{user.username}</h1>
          <div className="button-group">
            <button className="edit-button" 
              onClick={() => navigate(`/modify_user/${user.id}`, { state: { user: user } })}>
              Edit details
            </button>
            <button className="edit-button" 
              onClick={() => navigate(`/modify_password/${user.id}`, { state: { user: user } })}>
              Change password
            </button>
          </div>
        </div>
        <div className="profile-info">
          <p className="username-display"><strong>Role:</strong> {user.role}</p>
          <p className="username-display"><strong>Email:</strong> {user.email}</p>
          <p className="username-display"><strong>Phone:</strong> {user.phone}</p>
        </div>
      </div>
      {user.role == "client" ? <></> : 
        <div className="profile-content">
          <h2 className="queue-display-name">Assigned Queues:</h2>
          <div className="queues-container">
            {user.queues.map(queue => (
              <div key={queue.id} className="queue-bubble">
                {queue.name}
                <button className="button delete-queue" onClick={() => deleteQueue(queue.id)}>
                  Delete
                </button>
              </div>
            ))}
            <div className="queue-bubble add-queue-bubble" 
              onClick={() => setShowQueueForm(!showQueueForm)}>
              Add Queue
            </div>
          </div>
          {showQueueForm && (
            <QueueForm onClose={() => setShowQueueForm(false)} />
          )}
        </div>
      }
    </div>
  )
}

export default Profile

