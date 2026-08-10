import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  return (
    <footer style={{
      backgroundColor: colors.secondaryBg,
      borderTop: `1px solid ${colors.primary}`,
      padding: '60px 0 30px 0',
      marginTop: '50px'
    }}>
      <div className="container">
        <div className="row">
          {/* Brand Column */}
          <div className="col-lg-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: colors.primary,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px'
              }}>
                <span style={{
                  color: colors.mainBg,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  fontFamily: 'serif'
                }}>
                  R
                </span>
              </div>
              <h4 style={{ 
                color: colors.primary, 
                fontFamily: 'serif',
                letterSpacing: '3px',
                marginBottom: 0
              }}>
                ROYENZA
              </h4>
            </div>
            <p style={{ color: colors.lightGray, fontSize: '14px', lineHeight: '1.6' }}>
              Experience fine dining at its best. Where culinary excellence meets elegant ambiance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 mb-4">
            <h5 style={{ color: colors.primary, marginBottom: '20px', letterSpacing: '1px' }}>
              QUICK LINKS
            </h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/" style={{ 
                  color: colors.lightGray, 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                /* FIXED: Upgraded e.target references to e.currentTarget for event isolation */
                onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.lightGray}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/reservation" style={{ 
                  color: colors.lightGray, 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.lightGray}>
                  Reserve Table
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/my-booking" style={{ 
                  color: colors.lightGray, 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.lightGray}>
                  My Booking
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/admin" style={{ 
                  color: colors.lightGray, 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.lightGray}>
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 mb-4">
            <h5 style={{ color: colors.primary, marginBottom: '20px', letterSpacing: '1px' }}>
              CONTACT US
            </h5>
            <div style={{ color: colors.lightGray, fontSize: '14px' }}>
              <p style={{ marginBottom: '10px' }}>
                <span style={{ color: colors.white, fontWeight: '600' }}>Phone :</span> +92 340 7146871
              </p>
              <p style={{ marginBottom: '10px' }}>
                <span style={{ color: colors.white, fontWeight: '600' }}>Email :</span> abdulghani4920@gmail.com
              </p>
              <p style={{ marginBottom: '10px' }}>
                <span style={{ color: colors.white, fontWeight: '600' }}>Hours :</span> Mon-Sun: 12:00 PM - 11:00 PM
              </p>
              <p>
                <span style={{ color: colors.white, fontWeight: '600' }}>Address :</span> 29-A Gulgasht Colony, Multan
              </p>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: '#333', margin: '30px 0' }} />
        
        <div className="text-center">
          <p style={{ color: colors.lightGray, fontSize: '13px', marginBottom: 0 }}>
            © 2026 Royenza Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;