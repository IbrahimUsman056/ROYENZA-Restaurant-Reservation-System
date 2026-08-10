import React from 'react';
import HeroSection from '../components/HeroSection';
import images from '../assets/images/ImageData';

const Home = () => {
  const colors = {
    primary: '#F5BD02',
    white: '#FFFFFF',
    lightGray: '#CCCCCC',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A'
  };

  // Extracted menu data for cleaner JSX mapping
  const specialties = [
    {
      id: 'steak',
      title: 'Premium Steaks',
      image: images.steak,
      description: 'Hand-cut premium steaks grilled to perfection with our signature seasoning.'
    },
    {
      id: 'pasta',
      title: 'Italian Pasta',
      image: images.pasta,
      description: 'Authentic Italian pasta made with fresh ingredients and homemade sauces.'
    },
    {
      id: 'dessert',
      title: 'Desserts',
      image: images.dessert,
      description: 'Decadent desserts crafted by our pastry chefs to satisfy your sweet tooth.'
    }
  ];

  return (
    /* ADDED: paddingTop to push down content hidden under fixed Navbar */
    <div style={{ backgroundColor: colors.mainBg, paddingTop: '90px' }}>
      
      {/* Hero Section */}
      <HeroSection />

      {/* Restaurant Intro Section */}
      <div style={{ backgroundColor: colors.secondaryBg, padding: '80px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              {/* UPDATED: Styled and highlighted ROYENZA with letter-spacing and text-shadow */}
              <h2 style={{ color: colors.white, fontSize: '38px', marginBottom: '25px', fontWeight: 'normal' }}>
                Welcome to{' '}
                <span style={{ 
                  color: colors.primary, 
                  fontWeight: '800', 
                  letterSpacing: '2px',
                  textShadow: `0px 0px 15px rgba(245, 189, 2, 0.3)` 
                }}>
                  ROYENZA
                </span>
              </h2>
              <p style={{ color: colors.lightGray, fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
                Nestled in the heart of the city, <strong style={{ color: colors.primary }}>Royenza</strong> offers an unparalleled dining experience 
                that combines exquisite cuisine with elegant ambiance. Our master chefs bring you 
                a fusion of traditional and contemporary flavors.
              </p>
              <p style={{ color: colors.lightGray, fontSize: '16px', lineHeight: '1.8' }}>
                Whether it's a romantic dinner, family gathering, or business meeting, 
                Royenza provides the perfect setting for every occasion.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src={images.interior1}
                alt="Restaurant Interior"
                style={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  border: `2px solid ${colors.primary}`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Dining Section */}
      <div style={{ padding: '80px 0', backgroundColor: colors.mainBg }}>
        <div className="container">
          <h2 className="text-center" style={{ color: colors.primary, marginBottom: '50px', fontSize: '36px' }}>
            Our Specialties
          </h2>
          <div className="row">
            {specialties.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: '15px',
                  border: `2px solid ${colors.primary}`,
                  overflow: 'hidden',
                  height: '100%'
                }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '25px', textAlign: 'center' }}>
                    <h4 style={{ color: colors.primary, marginBottom: '15px' }}>{item.title}</h4>
                    <p style={{ color: colors.lightGray }}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parking Info Section */}
      <div style={{ backgroundColor: colors.secondaryBg, padding: '80px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <div style={{
                backgroundColor: colors.cardBg,
                borderRadius: '15px',
                padding: '40px',
                border: `1px solid ${colors.primary}`
              }}>
                <h3 style={{ color: colors.primary, marginBottom: '20px' }}>
                  <span role="img" aria-label="parking">🅿️</span> Parking Available
                </h3>
                <p style={{ color: colors.lightGray, fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
                  We offer complimentary valet parking for all our guests. 
                  You can also reserve a parking slot in advance when making your table reservation.
                </p>
                <ul style={{ color: colors.lightGray, listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}>✓ Free Valet Parking</li>
                  <li style={{ marginBottom: '10px' }}>✓ 50+ Vehicle Capacity</li>
                  <li style={{ marginBottom: '10px' }}>✓ 24/7 Security</li>
                  <li style={{ marginBottom: '10px' }}>✓ Covered Parking Area</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src={images.parking}
                alt="Parking Area"
                style={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  border: `2px solid ${colors.primary}`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;