import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, SignUp, ForgotPassword, OtpEntry, ResetPassword } from "./Auth";
import { Splash, Home, History, DueDiligence, Services, Lostland,Profile } from './pages';
import { DefaultLayout } from "./component";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './component/ProtectedRoute'; // For protecting main routes
import RedirectIfAuthenticated from './component/RedirectIfAuthenticated'; // New component to prevent auth pages access when logged in

function App() {
  const [loading, setLoading] = useState(true);

  // Simulate loading for splash screen (e.g., 1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Conditionally render the splash screen or the actual app
  if (loading) {
    return <Splash />;
  }

  return (
    <div className="min-h-[100vh]">
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Public Routes with RedirectIfAuthenticated */}
          <Route
            path="/"
            element={
              <RedirectIfAuthenticated>
                <SignUp />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OtpEntry />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <Home />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <History />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/due-diligence"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <DueDiligence />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <Services />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost-lands"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <Lostland />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <Profile />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
