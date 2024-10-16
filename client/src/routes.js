import App from "./App.js"
import Home from "./pages/Home.js"
import Profile from "./pages/Profile.js"
import Ticket from "./pages/Ticket.js"
import ModifyTicketForm from "./forms/ModifyTicketForm.js"
import NewTicketForm from "./forms/NewTicketForm.js"
import ModifyUserForm from "./forms/ModifyUserForm.js"
import ModifyPasswordForm from "./forms/ModifyPasswordForm.js"


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
          path: "/modify_user/:id",
          element: <ModifyUserForm />
        },
        {
          path: "/modify_password/:id",
          element: <ModifyPasswordForm />
        },
        {
          path: "/ticket/:id",
          element: <Ticket />
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
