import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import ProtectedRoute from '@/components/private-route/protected-route';
import Layout from '@/components/sections/layout';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import IncomePage from './pages/income-page'
import CategoryPage from './pages/category-page';
import BudgePage from './pages/budge-page';
import ExpensePage from './pages/expense-page';
import LandingPage from './pages/landing-page';
import DashboardPage from './pages/dashboard-page';
import ReportPage from './pages/report-page';
import RedirectAuthenticated from './components/private-route/redirect-authenticated';
import RecurringExpense from './components/sections/recurring-expense';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<RedirectAuthenticated><Outlet /></RedirectAuthenticated>}>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route >
          {/* protected route with layout */}
          <Route element={<ProtectedRoute><Layout ><Outlet /></Layout></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage/>} />
              <Route path='/income' element={<IncomePage/>} />
              <Route path='/expense' element={<ExpensePage/>} />
              <Route path='/recurring-expense' element={<RecurringExpense/>} />
              <Route path='/budget' element={<BudgePage/>} />
              <Route path='/category' element={<CategoryPage/>} />
              <Route path='/report' element={<ReportPage/>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

