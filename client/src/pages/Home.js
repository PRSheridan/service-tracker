import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import QueueDisplay from "../components/QueueDisplay";

function Home() {
    const [queues, setQueues] = useState([])

    useEffect(() => {
        
        fetch(`/user/queues`)
          .then(response => response.json())
          .then(data => {
            setQueues(data);
          })
      }, []);

    return (
        <div className="queue-list">
            { queues.length > 0 ? ( queues.map((queue) => (
                <QueueDisplay key={queue.name} queue={ queue }/>
            ))) : (
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div>Loading...</div>
                </div>
            )}
        </div>
    )
}

export default Home;