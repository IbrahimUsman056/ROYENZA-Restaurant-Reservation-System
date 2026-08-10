import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  // Colors from the theme
  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  // State for login form
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) setError('');
  };

  // Handle form submission using backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setError('Please enter username');
      triggerShake();
      return;
    }
    if (!formData.password.trim()) {
      setError('Please enter password');
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Send the login details to your Node/Express backend API
      const response = await fetch(
        'https://royenza-restaurant-reservation-system.onrender.com/api/bookings/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          }),
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Keep these if your dashboard checks them, but the security is now handled by the cookie token!
        localStorage.setItem('royneza_admin_logged_in', 'true');
        localStorage.setItem('royneza_admin_username', formData.username);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
        triggerShake();
      }
    } catch (err) {
      console.error("Login connection error:", err);
      setError('Unable to connect to the authentication server.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely trigger shake animation
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Input style
  const inputStyle = {
    backgroundColor: colors.cardBg,
    border: `1px solid #333`,
    color: colors.white,
    padding: '15px 16px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <div style={{
      backgroundColor: colors.mainBg,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Dynamic Keyframes Injected Safely */}
      <style>
        {`
          @keyframes formShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
          }
        `}
      </style>

      {/* Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(245, 189, 2, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245, 189, 2, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 0
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            {/* Login Form Wrapper */}
            <div style={{
              backgroundColor: colors.secondaryBg,
              borderRadius: '20px',
              padding: '50px 40px',
              border: `1px solid #333`,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              animation: isShaking ? 'formShake 0.5s' : 'none'
            }}>
              {/* Logo and Header */}
              <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '25px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: colors.primary,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    boxShadow: '0 10px 30px rgba(245, 189, 2, 0.3)'
                  }}>
                    <span style={{
                      color: colors.mainBg,
                      fontSize: '28px',
                      fontWeight: 'bold',
                      fontFamily: 'Playfair Display, serif'
                    }}>
                      R
                    </span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h2 style={{ 
                      color: colors.primary, 
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      letterSpacing: '4px',
                      marginBottom: '2px',
                      lineHeight: '1.2'
                    }}>
                      ROYENZA
                    </h2>
                    <p style={{ 
                      color: colors.lightGray, 
                      fontSize: '11px',
                      letterSpacing: '6px',
                      textTransform: 'uppercase',
                      marginBottom: 0
                    }}>
                      Admin Panel
                    </p>
                  </div>
                </div>

                {/* Divider with text */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginTop: '25px'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
                  <span style={{ 
                    color: colors.lightGray, 
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                  }}>
                    Sign In
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  backgroundColor: '#dc354510',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px'
                }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#dc3545',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.white,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>!</span>
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    color: colors.lightGray,
                    marginBottom: '10px',
                    fontWeight: '500',
                    fontSize: '13px',
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    disabled={loading}
                    value={formData.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={inputStyle}
                    placeholder="Enter your username"
                    autoComplete="username"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 189, 2, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#333';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{
                    color: colors.lightGray,
                    marginBottom: '10px',
                    fontWeight: '500',
                    fontSize: '13px',
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      disabled={loading}
                      value={formData.password}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      style={inputStyle}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.primary;
                        e.target.style.boxShadow = '0 0 0 3px rgba(245, 189, 2, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#333';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: colors.lightGray,
                        cursor: 'pointer',
                        padding: '5px',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = colors.primary}
                      onMouseLeave={(e) => e.target.style.color = colors.lightGray}
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#b89200' : colors.primary,
                    color: colors.mainBg,
                    fontWeight: '600',
                    padding: '15px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '15px',
                    letterSpacing: '1px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    fontFamily: 'Poppins, sans-serif',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    if (loading) return;
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 30px rgba(245, 189, 2, 0.3)';
                    e.target.style.backgroundColor = '#d4a800';
                  }}
                  onMouseLeave={(e) => {
                    if (loading) return;
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.backgroundColor = colors.primary;
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </button>
              </form>

              {/* SPA Back Link */}
              <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <Link 
                  to="/" 
                  style={{
                    color: colors.lightGray,
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => e.target.style.color = colors.primary}
                  onMouseLeave={(e) => e.target.style.color = colors.lightGray}
                >
                  Back to Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;