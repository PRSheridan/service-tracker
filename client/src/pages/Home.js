import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import UserContext from "../context";
import QueueDisplay from "../components/QueueDisplay";

//this is where I can useContext: queuedisplay needs user...
// i could easily pass it as a prop but I'll just do it for the requirement

function Home() {
    const navigate = useNavigate()
    const user = useOutletContext()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        const url = user.role === "client" ? `/user/tickets` : `/user/queues`;
        fetch(url)
            .then((response) => response.json())
            .then((fetchedData) => {
                setData(fetchedData)
                setIsLoading(false)
            });
    }, [user.role]);

    return (
        <div className="queue-list">
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <div>Loading...</div>
                </div>
            ) : (
                <>
                    {user.role === "client" ? (
                        <div className="client-tickets">
                            <div className="queue-display-name">{user.username}'s tickets:</div>
                            <div className="queue-display-header">
                                <div className="ticket-column">Ticket ID</div>
                                <div className="ticket-column">Title</div>
                                <div className="ticket-column">Requestor</div>
                                <div className="ticket-column">Status</div>
                                <div className="ticket-column">Date</div>
                            </div>
                        {data.length > 0 ? (data
                            .slice()
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((ticket) => (
                            <div key={ticket.id} className="ticket-row"
                                    onClick={() => navigate(`/ticket/${ticket.id}`, {state: {ticket: ticket, user: user}})}>
                                <div className="ticket-cell">{ticket.id}</div>
                                <div className="ticket-cell">{ticket.title}</div>
                                <div className="ticket-cell">{ticket.requestor.username}</div>
                                <div className="ticket-cell">{ticket.status}</div>
                                <div className="ticket-cell">{ticket.date}</div>
                            </div>
                            ))
                        ) : (
                            <div>No tickets to display.</div>
                        )}
                        </div>
                    ) : (
                        <div className="admin-queues">
                            {data.length > 0 ? (
                                data.map((queue) => (
                                    <UserContext.Provider value={ user }>
                                        <QueueDisplay key={queue.name} queue={queue} />
                                    </UserContext.Provider>
                                ))
                            ) : (
                                <div>No queues to display.</div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;