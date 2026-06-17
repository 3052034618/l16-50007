import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import Dashboard from "@/pages/Dashboard";
import TaskList from "@/pages/TaskList";
import TaskDetail from "@/pages/TaskDetail";
import NewTask from "@/pages/NewTask";
import Recommend from "@/pages/Recommend";
import Approval from "@/pages/Approval";
import Quality from "@/pages/Quality";
import Materials from "@/pages/Materials";
import SettingsPage from "@/pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<NewTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/approval" element={<Approval />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
