import { useEffect, useState } from 'react'
import CreateQueueForm from "../forms/CreateQueueForm"
import CreateTagForm from "../forms/CreateTagForm"

function Admin() {
  const [users, setUsers] = useState([])
  const [queues, setQueues] = useState([])
  const [tags, setTags] = useState([])
  const [showQueueForm, setShowQueueForm] = useState(false)
  const [showTagForm, setShowTagForm] = useState(false)

  useEffect(() => {
    fetch('/users').then(res => res.json()).then(data => setUsers(data))
    fetch('/queues').then(res => res.json()).then(data => setQueues(data))
    fetch('/tags').then(res => res.json()).then(data => setTags(data))
  }, [showTagForm, showQueueForm])

  function deleteUser(userID) {
    fetch(`/user/${userID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userID))
      }
    })
  }
  
  function deleteQueue(queueID) {
    fetch(`/queue/${queueID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      if (response.ok) {
        setQueues(queues.filter((queue) => queue.id !== queueID))
      }
    })
  }
  
  function deleteTag(tagID) {
    fetch(`/tag/${tagID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      if (response.ok) {
        setTags(tags.filter((tag) => tag.id !== tagID))
      }
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-column">
        <div className="display-name">Users</div>
        <div className="spacer"></div>
        <div className="item-list">
          {users.map(user => (
            <div key={user.id} className="item">
              {user.id} - {user.username}
              <button onClick={() => deleteUser(user.id)} className="delete-button">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-column">
        <div className="header">
          <div className="display-name">Queues</div>
          <button className="button add-queue"
                  onClick={() => setShowQueueForm(!showQueueForm)}>Add New Queue</button>
        {showQueueForm && (
        <div className="queue-form">
            <CreateQueueForm onClose={() => { setShowQueueForm(false) }}/>
        </div>
        )}
        </div>
        <div className="item-list">
          {queues.map(queue => (
            <div key={queue.id} className="item">
              {queue.id} - {queue.name}
              <button onClick={() => deleteQueue(queue.id)} className="delete-button">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-column">
        <div className="header">
          <div className="display-name">Tags</div>
          <button className="button add-tag"
                  onClick={() => setShowTagForm(!showTagForm)}>Add New Tag</button>
        {showTagForm && (
        <div className="tag-form">
            <CreateTagForm onClose={() => { setShowTagForm(false) }}/>
        </div>
        )}
        </div>
        <div className="item-list">
          {tags.map(tag => (
            <div key={tag.id} className="item">
              {tag.id} - {tag.name}
              <button onClick={() => deleteTag(tag.id)} className="delete-button">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Admin


