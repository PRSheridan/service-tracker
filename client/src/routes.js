import App from "./App.js"
import Home from "./pages/Home.js"
import Profile from "./pages/Profile.js"
import Queue from "./pages/Queue.js"
import Ticket from "./pages/Ticket.js"

const routes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/Home",
          element: <Home />
        },
        {
          path: "/Profile",
          element: <Profile />
        },
        {
          path: "/Queue",
          element: <Queue />
        },
        {
          path: "/Ticket",
          element: <Ticket />
        },
      ]
    },
];

export default routes;
