import React, { useEffect, useState, createContext} from "react";
import { useNavigate } from "react-router-dom";

import QueueDisplay from "../components/QueueDisplay";

const UserContext = createContext()

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
        <UserContext.Provider value={queues}>
            <div className="queue-list">
                { queues.length > 0 ? ( queues.map((queue) => (
                    <QueueDisplay key={queue.name} queue={ queue }/>
                ))) : (
                    <>No queues to display</>
                )}
            </div>
        </UserContext.Provider>
    )
}

export default Home;