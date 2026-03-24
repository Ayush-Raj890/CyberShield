import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserDashboard from "../pages/dashboard/UserDashboard";
import CreateReport from "../pages/reports/CreateReport";
import ViewReports from "../pages/reports/ViewReports";
import ScamDetector from "../pages/ai/ScamDetector";
import Articles from "../pages/knowledge/Articles";
import ArticleDetail from "../pages/knowledge/ArticleDetail";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageReports from "../pages/admin/ManageReports";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageArticles from "../pages/admin/ManageArticles";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><UserDashboard /></PrivateRoute>}
        />
        <Route
          path="/create-report"
          element={<PrivateRoute><CreateReport /></PrivateRoute>}
        />
        <Route
          path="/reports"
          element={<PrivateRoute><ViewReports /></PrivateRoute>}
        />
        <Route
          path="/ai"
          element={<PrivateRoute><ScamDetector /></PrivateRoute>}
        />
        <Route
          path="/articles"
          element={<PrivateRoute><Articles /></PrivateRoute>}
        />
        <Route
          path="/articles/:id"
          element={<PrivateRoute><ArticleDetail /></PrivateRoute>}
        />
        <Route
          path="/admin"
          element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>}
        />
        <Route
          path="/admin/reports"
          element={<PrivateRoute adminOnly={true}><ManageReports /></PrivateRoute>}
        />
        <Route
          path="/admin/users"
          element={<PrivateRoute adminOnly={true}><ManageUsers /></PrivateRoute>}
        />
        <Route
          path="/admin/articles"
          element={<PrivateRoute adminOnly={true}><ManageArticles /></PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}
