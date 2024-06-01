import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Home from "./comps/home";
import Test from "./comps/test";
import Test2 from "./comps/test2";
import Web from "./comps/web";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Web />,
  },
  {
    path: "/test",
    element: <Test />,
  },
]);
const root = document.getElementById("root") ?? new HTMLElement();
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
