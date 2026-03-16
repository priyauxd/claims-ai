import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SendClaim from "./pages/SendClaim";

export default function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/claim" element={<SendClaim />} />
      <Route path="*" element={<Navigate to="/claim" replace />} />
    </Routes>
  );
}
