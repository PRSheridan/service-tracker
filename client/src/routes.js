import App from "./App.js"
import Home from "./pages/Home.js"

const routes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/Home",
          element: <Home />
        },
      ]
    },
];

export default routes;
