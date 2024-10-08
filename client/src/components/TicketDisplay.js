import React, { useEffect, useState, createContext} from "react";
import { useNavigate } from "react-router-dom";

function TicketDisplay( {ticket} ) {


    return (
        <div className="ticket-display">
            {ticket.title}
        </div>
    )
}

export default TicketDisplay;