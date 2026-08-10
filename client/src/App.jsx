import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Reservation from './pages/Reservation';
import Confirmation from './pages/Confirmation';
import MyBooking from './pages/MyBooking';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/reservation" element={
            <>
              <Navbar />
              <Reservation />
              <Footer />
            </>
          } />
          <Route path="/confirmation" element={
            <>
              <Navbar />
              <Confirmation />
              <Footer />
            </>
          } />
          <Route path="/my-booking" element={
            <>
              <Navbar />
              <MyBooking />
              <Footer />
            </>
          } />
          
          {/* Admin Login - No Navbar/Footer */}
          <Route path="/admin" element={<AdminLogin />} />
          
          {/* Protected Admin Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;