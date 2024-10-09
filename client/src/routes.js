import App from "./App.js"
import Home from "./pages/Home.js"
import Profile from "./pages/Profile.js"
import Queue from "./pages/Queue.js"
import TicketDisplay from "./components/TicketDisplay.js"
import ModifyTicketForm from "./forms/ModifyTicketForm.js"
import NewTicketForm from "./forms/NewTicketForm.js"


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
          element: <TicketDisplay />
        },
        {
          path: "/new_ticket",
          element: <NewTicketForm />
        },
        {
          path: "/modify_ticket/:id",
          element: <ModifyTicketForm />
        },
      ]
    },
];

export default routes;
