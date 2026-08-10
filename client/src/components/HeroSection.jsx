import React from 'react';
import { Link } from 'react-router-dom';
import images from '../assets/images/ImageData';

const HeroSection = () => {
  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  return (
    <div style={{
      backgroundColor: colors.mainBg,
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background overlay pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle, #F5BD02 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.05
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div>
              {/* Welcome Badge */}
              <div style={{
                display: 'inline-block',
                backgroundColor: colors.secondaryBg,
                border: `1px solid ${colors.primary}`,
                padding: '8px 20px',
                borderRadius: '50px',
                marginBottom: '20px'
              }}>
                <span style={{ color: colors.primary, fontSize: '14px' }}>
                  ✨ Welcome to Fine Dining
                </span>
              </div>

              <h1 style={{
                color: colors.white,
                fontSize: '56px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                marginBottom: '15px'
              }}>
                Experience <span style={{ color: colors.primary }}>Royal</span> Dining
              </h1>

              <p style={{
                color: colors.lightGray,
                fontSize: '18px',
                lineHeight: '1.6',
                marginBottom: '30px'
              }}>
                Indulge in a luxurious culinary journey at Royenza. 
                Where every meal is crafted with passion and served with elegance.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Link 
                  to="/reservation" 
                  className="btn btn-lg"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.mainBg,
                    fontWeight: 'bold',
                    padding: '15px 35px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                  /* FIXED: Changed e.target to e.currentTarget to avoid emoji hover glitch */
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(245, 189, 2, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Reserve Your Table 🍽️
                </Link>

                <Link 
                  to="/my-booking" 
                  className="btn btn-lg"
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    fontWeight: 'bold',
                    padding: '15px 35px',
                    borderRadius: '10px',
                    border: `2px solid ${colors.primary}`,
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                  /* FIXED: Changed e.target to e.currentTarget to ensure clean background transitions */
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = colors.mainBg;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.primary;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View My Booking 📋
                </Link>
              </div>

              {/* Features Strip */}
              <div className="row mt-5">
                <div className="col-4 text-center">
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>⭐</div>
                  <h6 style={{ color: colors.primary }}>Premium Quality</h6>
                  <small style={{ color: colors.lightGray }}>Fresh Ingredients</small>
                </div>
                <div className="col-4 text-center">
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>👨‍🍳</div>
                  <h6 style={{ color: colors.primary }}>Expert Chefs</h6>
                  <small style={{ color: colors.lightGray }}>Master Culinary</small>
                </div>
                <div className="col-4 text-center">
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>🏆</div>
                  <h6 style={{ color: colors.primary }}>Award Winning</h6>
                  <small style={{ color: colors.lightGray }}>Best Restaurant 2026</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="col-lg-6">
            <div style={{
              position: 'relative',
              padding: '20px'
            }}>
              {/* Main Image Container */}
              <div style={{
                backgroundColor: colors.secondaryBg,
                borderRadius: '20px',
                padding: '15px',
                border: `2px solid ${colors.primary}`,
                position: 'relative'
              }}>
                {/* Restaurant Image */}
                <img
                  src={images.heroMain}
                  alt="Restaurant Interior"
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    border: `1px solid ${colors.primary}`
                  }}
                />

                {/* Floating Badge - Experience */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: colors.primary,
                  color: colors.mainBg,
                  padding: '15px 25px',
                  borderRadius: '15px',
                  fontWeight: 'bold',
                  transform: 'translate(20px, -20px)',
                  boxShadow: '0 10px 30px rgba(245, 189, 2, 0.4)'
                }}>
                  <div style={{ fontSize: '24px' }}>15+</div>
                  <small>Years Experience</small>
                </div>

                {/* Floating Badge - Rating */}
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '0',
                  backgroundColor: colors.mainBg,
                  border: `2px solid ${colors.primary}`,
                  padding: '15px 25px',
                  borderRadius: '15px',
                  color: colors.white,
                  transform: 'translate(-20px, 0)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ color: colors.primary, fontSize: '24px' }}>★★★★★</div>
                  <small style={{ color: colors.lightGray }}>4.9/5 Rating</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;