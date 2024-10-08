import App from "./App.js"
import Home from "./pages/Home.js"
import Profile from "./pages/Profile.js"
import Queue from "./pages/Queue.js"
import Ticket from "./pages/Ticket.js"
import TicketDisplay from "./components/TicketDisplay.js"

const routes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/home",
          element: <Home />
        },
        {
          path: "/profile",
          element: <Profile />
        },
        {
          path: "/queue",
          element: <Queue />
        },
        {
          path: "/modify_ticket",
          element: <Ticket />
        },
        {
          path: "/ticket/:id",
          element: <TicketDisplay />
        },
      ]
    },
];

export default routes;
