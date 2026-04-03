import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { StartHere } from "./pages/StartHere";
import { Results } from "./pages/Results";
import { Settings } from "./pages/Settings";
import { Vocabulary } from "./pages/Vocabulary";
import { Tasks } from "./pages/Tasks";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "start", Component: StartHere },
      { path: "results", Component: Results },
      { path: "settings", Component: Settings },
      { path: "unit/:id/vocabulary", Component: Vocabulary },
      { path: "unit/:id/tasks", Component: Tasks },
    ],
  },
]);