import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Insights from './pages/Insights';
import Goals from './pages/Goals';
import ShoppingList from './pages/ShoppingList';

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'];

function Shell({ collapsed, setCollapsed, children }) {
  const location = useLocation();
  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  if (isPublic) return <>{children}</>;

  return (
    <>
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`app-content ${collapsed ? 'app-content--collapsed' : ''}`}>
        {children}
      </div>
    </>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell collapsed={collapsed} setCollapsed={setCollapsed}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;