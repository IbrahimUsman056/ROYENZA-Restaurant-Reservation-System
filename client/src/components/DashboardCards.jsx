import React from 'react';

const DashboardCards = ({ bookings = [] }) => {
  const colors = {
    primary: '#F5BD02',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  const totalReservations = bookings.length;
  const pendingReservations = bookings.filter(b => b.status === 'Pending').length;
  const confirmedReservations = bookings.filter(b => b.status === 'Confirmed').length;
  const cancelledReservations = bookings.filter(b => b.status === 'Cancelled').length;

  const cards = [
    {
      title: 'Total Reservations',
      value: totalReservations,
      color: '#F5BD02',
      gradient: 'linear-gradient(135deg, #F5BD0215, #F5BD0205)',
      borderColor: '#F5BD0230',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5BD02" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    {
      title: 'Pending',
      value: pendingReservations,
      color: '#F5BD02',
      gradient: 'linear-gradient(135deg, #F5BD0215, #F5BD0205)',
      borderColor: '#F5BD0230',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5BD02" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      )
    },
    {
      title: 'Confirmed',
      value: confirmedReservations,
      color: '#28a745',
      gradient: 'linear-gradient(135deg, #28a74515, #28a74505)',
      borderColor: '#28a74530',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )
    },
    {
      title: 'Cancelled',
      value: cancelledReservations,
      color: '#dc3545',
      gradient: 'linear-gradient(135deg, #dc354515, #dc354505)',
      borderColor: '#dc354530',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      )
    }
  ];

  return (
    <div className="row">
      {cards.map((card, index) => (
        <div key={index} className="col-xl-3 col-md-6 mb-4">
          <div style={{
            background: card.gradient,
            borderRadius: '16px',
            padding: '30px',
            border: `1px solid ${card.borderColor}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = `0 15px 40px rgba(0, 0, 0, 0.4)`;
            e.currentTarget.style.borderColor = card.color;
          }}
          /* FIXED: Explicitly resetting styles to empty strings to avoid state leakage on array filter */
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.borderColor = '';
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: `${card.color}10`,
              pointerEvents: 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <span style={{ 
                  color: colors.lightGray, 
                  fontSize: '13px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {card.title}
                </span>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: `${card.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${card.color}30`
                }}>
                  {card.icon}
                </div>
              </div>
              
              <h2 style={{ 
                color: card.color, 
                fontWeight: '700', 
                marginBottom: '5px',
                fontSize: '42px',
                fontFamily: 'Poppins, sans-serif'
              }}>
                {card.value}
              </h2>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: card.color
                }}></div>
                <span style={{ color: colors.lightGray, fontSize: '12px' }}>
                  Total {card.title.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;