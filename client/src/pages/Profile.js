import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import NewQueueForm from "../forms/NewQueueForm";

function Profile() {
    const { user, setUser } = useOutletContext()
    const [showQueueForm, setShowQueueForm] = useState(false)

    useEffect(() => {
        fetch("/user")
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
                        response.json().then((updated_user) => setUser(updated_user));
                    }
                })
            }
        })
    }

    return (
        <div className="user-profile">
            <div>{user.username}</div>
            <div>{user.email}</div>
            <div>{user.phone}</div>
            <h2>Queues:</h2>
                <div className="queues-container">
                    {user.queues.map(queue => (
                        <div key={queue.id} className="queue-bubble">
                            {queue.name}
                            <button className="button delete-queue" 
                                    onClick={() => deleteQueue(queue.id)}>Delete</button>
                        </div>
                    ))}
                    <div className="queue-bubble add-queue-bubble" 
                            onClick={() => setShowQueueForm(!showQueueForm)}>Add queue</div>
                </div>
                {showQueueForm && (
                        <NewQueueForm onClose={() => setShowQueueForm(false)} />
                    )}
        </div>
    )
}

export default Profile;