import React, { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import UserContext from "../context"
import QueueDisplay from "../components/QueueDisplay"
import SearchBar from "../components/SearchBar"

function Home() {
  const {user, setUser, queues, setQueues} = useOutletContext()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    const url = user.role === "client" ? `/user/tickets` : `/user/queues`
    fetch(url)
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData)
        setIsLoading(false)
      })
  }, [user.role])

  return (
    <div className="queue-list">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div>Loading...</div>
        </div>
      ) : (
        <UserContext.Provider value={user}>
            {user.role == "client" ? (
            <div className="client-tickets">
              {data.length > 0 ? (
                <QueueDisplay userTickets={data} />
              ) : (
                <div>No tickets to display.</div>
              )}
            </div>
          ) : (
            <div className="admin-queues">
              <SearchBar queues={queues}/>
              {data.length > 0 ? (
                data.map((queue) => (
                    <QueueDisplay key={queue.name} queue={queue} queues={queues} />
                ))
              ) : (
                <div>No queues to display.</div>
              )}
            </div>
          )}
        </UserContext.Provider>
      )}
    </div>
  )
}

export default Home
