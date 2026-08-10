import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkStyle = (path) => {
    return {
      color: isActive(path) ? colors.primary : colors.lightGray,
      fontSize: '15px',
      fontWeight: isActive(path) ? '600' : '400',
      borderBottom: isActive(path) ? `2px solid ${colors.primary}` : '2px solid transparent',
      padding: '8px 0',
      margin: '0 15px',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      letterSpacing: '0.5px'
    };
  };

  const mobileLinkStyle = (path) => {
    return {
      color: isActive(path) ? colors.primary : colors.white,
      fontSize: '18px',
      fontWeight: isActive(path) ? '600' : '400',
      padding: '15px 20px',
      display: 'block',
      textDecoration: 'none',
      borderBottom: '1px solid #222',
      backgroundColor: isActive(path) ? '#F5BD0208' : 'transparent',
      transition: 'all 0.3s ease'
    };
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top" style={{
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.98)' : 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? '#222' : 'transparent'}`,
        padding: '12px 0',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}>
        <div className="container">
          {/* Brand Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: colors.primary,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              boxShadow: '0 0 20px rgba(245, 189, 2, 0.3)'
            }}>
              <span style={{
                color: colors.mainBg,
                fontSize: '20px',
                fontWeight: 'bold',
                fontFamily: 'Playfair Display, serif'
              }}>R</span>
            </div>
            <div className="d-none d-sm-block">
              {/* FIXED: Spelling updated to ROYENZA */}
              <div style={{
                color: colors.primary,
                fontSize: '22px',
                fontWeight: 'bold',
                letterSpacing: '3px',
                fontFamily: 'Playfair Display, serif',
                lineHeight: '1.2'
              }}>ROYENZA</div>
              <div style={{
                color: colors.lightGray,
                fontSize: '9px',
                letterSpacing: '4px',
                textTransform: 'uppercase'
              }}>Fine Dining</div>
            </div>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            className="navbar-toggler d-lg-none" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              padding: '8px',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <div style={{
              width: '24px',
              height: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: isOpen ? 'transparent' : colors.primary,
                transition: 'all 0.3s ease',
                transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                position: 'absolute',
                top: isOpen ? '50%' : '0'
              }}></span>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: isOpen ? 'transparent' : colors.primary,
                transition: 'all 0.3s ease',
                opacity: isOpen ? 0 : 1
              }}></span>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: isOpen ? 'transparent' : colors.primary,
                transition: 'all 0.3s ease',
                transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                position: 'absolute',
                bottom: isOpen ? '50%' : '0'
              }}></span>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                {/* FIXED: All target values adjusted to currentTarget */}
                <Link to="/" style={getLinkStyle('/')}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary; e.currentTarget.style.borderBottom = `2px solid ${colors.primary}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive('/') ? colors.primary : colors.lightGray; e.currentTarget.style.borderBottom = isActive('/') ? `2px solid ${colors.primary}` : '2px solid transparent'; }}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/reservation" style={getLinkStyle('/reservation')}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary; e.currentTarget.style.borderBottom = `2px solid ${colors.primary}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive('/reservation') ? colors.primary : colors.lightGray; e.currentTarget.style.borderBottom = isActive('/reservation') ? `2px solid ${colors.primary}` : '2px solid transparent'; }}>
                  Reserve Table
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-booking" style={getLinkStyle('/my-booking')}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary; e.currentTarget.style.borderBottom = `2px solid ${colors.primary}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive('/my-booking') ? colors.primary : colors.lightGray; e.currentTarget.style.borderBottom = isActive('/my-booking') ? `2px solid ${colors.primary}` : '2px solid transparent'; }}>
                  My Booking
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin" style={getLinkStyle('/admin')}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary; e.currentTarget.style.borderBottom = `2px solid ${colors.primary}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive('/admin') ? colors.primary : colors.lightGray; e.currentTarget.style.borderBottom = isActive('/admin') ? `2px solid ${colors.primary}` : '2px solid transparent'; }}>
                  Admin
                </Link>
              </li>
              <li className="nav-item ms-3">
                <Link to="/reservation" style={{
                  backgroundColor: colors.primary,
                  color: colors.mainBg,
                  padding: '10px 22px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4a800'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(245, 189, 2, 0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  RESERVE NOW
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '80px',
          overflowY: 'auto'
        }}>
          <div className="container">
            {/* Mobile Links */}
            <Link to="/" style={mobileLinkStyle('/')} onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/reservation" style={mobileLinkStyle('/reservation')} onClick={() => setIsOpen(false)}>
              Reserve Table
            </Link>
            <Link to="/my-booking" style={mobileLinkStyle('/my-booking')} onClick={() => setIsOpen(false)}>
              My Booking
            </Link>
            <Link to="/admin" style={mobileLinkStyle('/admin')} onClick={() => setIsOpen(false)}>
              Admin Panel
            </Link>

            {/* Mobile CTA */}
            <div style={{ padding: '20px', marginTop: '20px' }}>
              <Link to="/reservation" onClick={() => setIsOpen(false)} style={{
                backgroundColor: colors.primary,
                color: colors.mainBg,
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center',
                letterSpacing: '1px'
              }}>
                RESERVE NOW
              </Link>
            </div>

            {/* Mobile Contact Info */}
            <div style={{ padding: '20px', marginTop: '30px', borderTop: '1px solid #222' }}>
              <p style={{ color: '#666', fontSize: '13px', textAlign: 'center', marginBottom: '10px' }}>
                📞 +92 340 7146871
              </p>
              <p style={{ color: '#666', fontSize: '13px', textAlign: 'center' }}>
                📧 abdulghani4920@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;