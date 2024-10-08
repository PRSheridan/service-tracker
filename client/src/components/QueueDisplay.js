import React, { useEffect, useState, createContext} from "react";
import { useNavigate } from "react-router-dom";

import TicketDisplay from "../components/TicketDisplay";

function QueueDisplay( {queue} ) {


    return (
        <div id="queue-list">
            { queue.tickets.length > 0 ? ( queue.tickets.map((ticket) => (
                <TicketDisplay key={ticket.title} ticket={ ticket }/>
            ))) : (
                <>No tickets to display</>
            )}
        </div>
    )
}

export default QueueDisplay;