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
          path: "/ticket/:id",
          element: <Ticket />
        },
      ]
    },
];

export default routes;
