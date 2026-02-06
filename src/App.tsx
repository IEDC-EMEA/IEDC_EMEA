// import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Home, Team, Event, Entrepreneurs, Reports } from "@/pages";

import SingleEvent from "@/pages/SingleEvent";
import { GuestLayout } from "@/layout";

import AdminLayout from "@/layout/adminLayout";
import Dashboard from "@/pages/admin/dashboard";
import Teams from "./pages/admin/teams";
import Events from "./pages/admin/events";
import AdminEntrepreneurs from "./pages/admin/entrepreneurs";
import AdminReports from "./pages/admin/reports";
import FundTransactions from "./pages/admin/fund_transaction";

// import FormData from "@/pages/admin/formdata";

import Login from "./pages/admin/login";
import NotFound from "./notfound";

import "./App.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/team", element: <Team /> },
      { path: "/events", element: <Event /> },
      { path: "/event/:id", element: <SingleEvent /> },
      { path: "/entrepreneurs", element: <Entrepreneurs /> },
      { path: "/reports", element: <Reports /> },
    ],
  },

  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: ".",
        element: <Navigate to="" />,
      },
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "teams",
        element: <Teams />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "transactions",
        element: <FundTransactions />,
      },
      {
        path: "entrepreneurs",
        element: <AdminEntrepreneurs />,
      },
      {
        path: "reports",
        element: <AdminReports />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <Home />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
