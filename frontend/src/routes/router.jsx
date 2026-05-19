import { Navigate, createBrowserRouter } from "react-router-dom";

import { RequireAuth } from "../components/auth/RequireAuth";
import { AdminLayout } from "../components/layout/AdminLayout";
import { GuestLayout } from "../components/layout/GuestLayout";
import AnalyticsPage from "../pages/AnalyticsPage";
import CreateEventPage from "../pages/CreateEventPage";
import DashboardPage from "../pages/DashboardPage";
import EventEntryPage from "../pages/EventEntryPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ResultGalleryPage from "../pages/ResultGalleryPage";
import SelfieUploadPage from "../pages/SelfieUploadPage";
import UploadPhotosPage from "../pages/UploadPhotosPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <EventEntryPage /> },
      { path: "event/:eventCode", element: <SelfieUploadPage /> },
      { path: "event/:eventCode/results", element: <ResultGalleryPage /> }
    ]
  },
  {
    path: "/admin/login",
    element: <LoginPage />
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "events/new", element: <CreateEventPage /> },
      { path: "uploads", element: <UploadPhotosPage /> },
      { path: "analytics", element: <AnalyticsPage /> }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

