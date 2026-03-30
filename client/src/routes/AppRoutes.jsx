import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/account/Settings";
import CreateReport from "../pages/reports/CreateReport";
import ViewReports from "../pages/reports/ViewReports";
import ScamDetector from "../pages/ai/ScamDetector";
import Articles from "../pages/knowledge/Articles";
import ArticleDetail from "../pages/knowledge/ArticleDetail";
import Forum from "../pages/forum/Forum";
import CreatePost from "../pages/forum/CreatePost";
import VideoHub from "../pages/video/VideoHub";
import SubmitVideo from "../pages/video/SubmitVideo";
import MemeHub from "../pages/fun/MemeHub";
import SubmitMeme from "../pages/fun/SubmitMeme";
import PhishingGame from "../pages/games/PhishingGame";
import ManageReports from "../pages/admin/ManageReports";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageArticles from "../pages/admin/ManageArticles";
import VideoModeration from "../pages/admin/VideoModeration";
import MemeModeration from "../pages/admin/MemeModeration";
import Notifications from "../pages/admin/Notifications";
import ErrorLogs from "../pages/admin/ErrorLogs";
import NotFound from "../pages/errors/NotFound";
import ServerError from "../pages/errors/ServerError";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><Profile /></PrivateRoute>}
        />
        <Route
          path="/settings"
          element={<PrivateRoute><Settings /></PrivateRoute>}
        />
        <Route
          path="/create-report"
          element={<PrivateRoute><CreateReport /></PrivateRoute>}
        />
        <Route
          path="/reports"
          element={<ViewReports />}
        />
        <Route
          path="/ai"
          element={<ScamDetector />}
        />
        <Route
          path="/articles"
          element={<Articles />}
        />
        <Route
          path="/articles/:id"
          element={<ArticleDetail />}
        />
        <Route
          path="/forum"
          element={<Forum />}
        />
        <Route
          path="/videos"
          element={<VideoHub />}
        />
        <Route
          path="/memes"
          element={<MemeHub />}
        />
        <Route
          path="/videos/submit"
          element={<PrivateRoute><SubmitVideo /></PrivateRoute>}
        />
        <Route
          path="/memes/upload"
          element={<PrivateRoute><SubmitMeme /></PrivateRoute>}
        />
        <Route
          path="/games"
          element={<PrivateRoute><PhishingGame /></PrivateRoute>}
        />
        <Route
          path="/forum/create"
          element={<PrivateRoute><CreatePost /></PrivateRoute>}
        />
        <Route
          path="/admin"
          element={<PrivateRoute adminOnly={true}><Dashboard /></PrivateRoute>}
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
        <Route
          path="/admin/videos"
          element={<PrivateRoute adminOnly={true}><VideoModeration /></PrivateRoute>}
        />
        <Route
          path="/admin/memes"
          element={<PrivateRoute adminOnly={true}><MemeModeration /></PrivateRoute>}
        />
        <Route
          path="/admin/notifications"
          element={<PrivateRoute adminOnly={true}><Notifications /></PrivateRoute>}
        />
        <Route
          path="/admin/error-logs"
          element={<PrivateRoute adminOnly={true}><ErrorLogs /></PrivateRoute>}
        />
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
