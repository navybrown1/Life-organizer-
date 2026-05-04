import { Routes, Route } from 'react-router'
import AuthLayout from "@/components/AuthLayout"
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Goals from './pages/Goals'
import Notes from './pages/Notes'
import AI from './pages/AI'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={
        <AuthLayout>
          <Dashboard />
        </AuthLayout>
      } />
      <Route path="/tasks" element={
        <AuthLayout>
          <Tasks />
        </AuthLayout>
      } />
      <Route path="/calendar" element={
        <AuthLayout>
          <Calendar />
        </AuthLayout>
      } />
      <Route path="/goals" element={
        <AuthLayout>
          <Goals />
        </AuthLayout>
      } />
      <Route path="/notes" element={
        <AuthLayout>
          <Notes />
        </AuthLayout>
      } />
      <Route path="/ai" element={
        <AuthLayout>
          <AI />
        </AuthLayout>
      } />
    </Routes>
  )
}
