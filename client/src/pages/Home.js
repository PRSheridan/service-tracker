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
        <div id="queue-list">
            <div>Home</div>
            { queues.length > 0 ? ( queues.map((queue) => (
                <QueueDisplay key={queue.name} queue={ queue }/>
            ))) : (
                <>No queues to display</>
            )}
        </div>

    )
}

export default Home;