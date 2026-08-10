import React from 'react';
import { Link } from 'react-router-dom';

// Detail Row Component (Moved to top of scope to ensure correct runtime registration)
const DetailRow = ({ label, value, highlight, mono }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #1a1a1a'
    }}>
      <span style={{ 
        color: '#888', 
        fontSize: '13px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </span>
      <span style={{ 
        color: highlight ? '#F5BD02' : '#FFFFFF', 
        fontSize: '14px',
        fontWeight: highlight ? '600' : '400',
        textAlign: 'right',
        maxWidth: '60%',
        fontFamily: mono ? 'monospace' : 'Poppins, sans-serif',
        letterSpacing: mono ? '1px' : '0'
      }}>
        {value || 'N/A'}
      </span>
    </div>
  );
};

const BookingCard = ({ booking }) => {
  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  if (!booking) {
    return null;
  }

  // Function to get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed':
        return { 
          backgroundColor: '#28a74515',
          color: '#28a745',
          border: '1px solid #28a74530',
          text: 'CONFIRMED',
          dot: '#28a745',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          )
        };
      case 'Cancelled':
        return { 
          backgroundColor: '#dc354515',
          color: '#dc3545',
          border: '1px solid #dc354530',
          text: 'CANCELLED',
          dot: '#dc3545',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )
        };
      case 'Payment Pending':
        return { 
          backgroundColor: '#F5BD0215',
          color: '#F5BD02',
          border: '1px solid #F5BD0230',
          text: 'PAYMENT PENDING',
          dot: '#F5BD02',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5BD02" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="6" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )
        };
      default:
        return { 
          backgroundColor: '#F5BD0215',
          color: '#F5BD02',
          border: '1px solid #F5BD0230',
          text: 'PENDING',
          dot: '#F5BD02',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5BD02" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          )
        };
    }
  };

  const statusBadge = getStatusBadge(booking.status);

  const formatTableType = (type) => {
    const types = {
      standard: 'Standard Table',
      vip: 'VIP Lounge',
      family: 'Family Section',
      couple: "Couple's Corner",
      outdoor: 'Outdoor Terrace'
    };
    return types[type] || type;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      borderRadius: '20px',
      padding: '40px',
      border: '1px solid #333',
      maxWidth: '650px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decoration */}
      <div style={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        backgroundColor: '#F5BD0205',
        pointerEvents: 'none'
      }}></div>

      {/* Watermark - FIXED typo to matches ROYENZA branding */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '100px',
        color: '#FFFFFF03',
        fontWeight: 'bold',
        pointerEvents: 'none',
        fontFamily: 'Playfair Display, serif',
        letterSpacing: '20px',
        whiteSpace: 'nowrap'
      }}>
        ROYENZA
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '25px',
          borderBottom: '2px dashed #222'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: colors.primary,
              borderRadius: '15px',
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
              }}>R</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              {/* FIXED Brand string name variant */}
              <h2 style={{ 
                color: colors.primary, 
                fontFamily: 'Playfair Display, serif',
                fontSize: '28px',
                letterSpacing: '4px',
                marginBottom: '2px'
              }}>ROYENZA</h2>
              <p style={{ 
                color: colors.lightGray, 
                fontSize: '11px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                marginBottom: 0
              }}>Fine Dining</p>
            </div>
          </div>

          <h3 style={{ 
            color: colors.white, 
            fontFamily: 'Playfair Display, serif',
            fontSize: '22px',
            marginBottom: '5px'
          }}>
            {booking.status === 'Confirmed' ? 'RESERVATION CONFIRMED' : 
             booking.status === 'Cancelled' ? 'RESERVATION CANCELLED' : 
             booking.status === 'Payment Pending' ? 'PAYMENT REQUIRED' :
             'RESERVATION PENDING'}
          </h3>
          <p style={{ color: colors.lightGray, fontSize: '13px', marginBottom: 0 }}>
            Receipt #{booking.bookingId}
          </p>
        </div>

        {/* Status Banner */}
        <div style={{
          backgroundColor: statusBadge.backgroundColor,
          border: statusBadge.border,
          borderRadius: '12px',
          padding: '15px 20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <span style={{
            color: statusBadge.color,
            fontWeight: '600',
            fontSize: '14px',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {statusBadge.icon}
            {statusBadge.text}
          </span>
          {booking.status === 'Payment Pending' && (
            <p style={{ color: colors.lightGray, fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
              Please complete payment to confirm your reservation
            </p>
          )}
        </div>

        {/* Customer Information */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{
            color: colors.primary,
            fontFamily: 'Playfair Display, serif',
            fontSize: '16px',
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '1px solid #222'
          }}>
            CUSTOMER INFORMATION
          </h4>
          <DetailRow label="Name" value={booking.customerName} />
          <DetailRow label="Email" value={booking.email} />
          <DetailRow label="Phone" value={booking.phone} />
          <DetailRow label="WhatsApp" value={booking.whatsapp} />
        </div>

        {/* Reservation Details */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{
            color: colors.primary,
            fontFamily: 'Playfair Display, serif',
            fontSize: '16px',
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '1px solid #222'
          }}>
            RESERVATION DETAILS
          </h4>
          <DetailRow label="Date" value={formatDate(booking.bookingDate)} highlight />
          <DetailRow label="Time" value={`${booking.startTime} - ${booking.endTime}`} />
          <DetailRow label="Guests" value={`${booking.guests} ${booking.guests > 1 ? 'Persons' : 'Person'}`} />
          <DetailRow label="Table Type" value={formatTableType(booking.tableType)} />
          <DetailRow label="Booking ID" value={booking.bookingId} mono />
        </div>

        {/* Parking Details */}
        {booking.needParking && booking.parking && (
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{
              color: colors.primary,
              fontFamily: 'Playfair Display, serif',
              fontSize: '16px',
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #222'
            }}>
              PARKING DETAILS
            </h4>
            <DetailRow label="Vehicle Type" value={booking.parking.vehicleType === 'car' ? 'Car' : 'Bike'} />
            <DetailRow label="Vehicle Number" value={booking.parking.vehicleNumber} highlight />
            <DetailRow label="Model" value={booking.parking.vehicleModel} />
            <DetailRow label="Color" value={booking.parking.vehicleColor} />
            
            {/* Assigned Parking Slot */}
            <div style={{
              backgroundColor: '#F5BD0210',
              border: '1px solid #F5BD0230',
              borderRadius: '10px',
              padding: '15px',
              marginTop: '15px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>
                Assigned Parking Slot
              </p>
              <p style={{ color: colors.primary, fontSize: '32px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '3px', marginBottom: 0 }}>
                {booking.parking.parkingSlot}
              </p>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {booking.payment && (
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{
              color: colors.primary,
              fontFamily: 'Playfair Display, serif',
              fontSize: '16px',
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #222'
            }}>
              PAYMENT DETAILS
            </h4>
            <DetailRow label="Payment Method" value={booking.payment.methodName} />
            <DetailRow label="Transaction ID" value={booking.payment.transactionId} mono />
            <DetailRow label="Amount Paid" value={`PKR ${booking.payment.amount?.toLocaleString()}`} highlight />
            <DetailRow label="Paid At" value={booking.payment.paidAt ? new Date(booking.payment.paidAt).toLocaleString() : ''} />
            
            {booking.payment.screenshot && (
              <div style={{ 
                marginTop: '15px', 
                textAlign: 'center',
                backgroundColor: '#111',
                borderRadius: '10px',
                padding: '15px',
                border: '1px solid #222'
              }}>
                <p style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Payment Screenshot
                </p>
                <img 
                  src={booking.payment.screenshot} 
                  alt="Payment Screenshot" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '10px',
                    border: '1px solid #333',
                    cursor: 'pointer',
                    objectFit: 'contain'
                  }}
                  onClick={() => window.open(booking.payment.screenshot, '_blank')}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = '<p style="color:#666;font-size:13px;">Screenshot not available</p>';
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div style={{
          marginTop: '30px',
          paddingTop: '25px',
          borderTop: '2px dashed #222',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
            Booking created on {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : ''}
          </p>
          <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
            For any queries, contact us at +92 340 7146871
          </p>
          <p style={{ color: '#666', fontSize: '12px', marginBottom: 0 }}>
            Please arrive 10 minutes before your reservation time
          </p>
        </div>

        {/* Barcode Decoration */}
        <div style={{
          marginTop: '25px',
          display: 'flex',
          justifyContent: 'center',
          gap: '3px'
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              width: '3px',
              height: `${Math.sin(i) * 10 + 25}px`, // Fixed randomized height shift layout shifts on rendering re-evaluation
              backgroundColor: '#222',
              borderRadius: '1px'
            }}></div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/reservation" 
            style={{
              backgroundColor: colors.primary,
              color: colors.mainBg,
              fontWeight: '600',
              padding: '14px 28px',
              borderRadius: '10px',
              border: 'none',
              textDecoration: 'none',
              fontSize: '14px',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              fontFamily: 'Poppins, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            /* FIXED: target -> currentTarget safety updates */
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 189, 2, 0.3)';
              e.currentTarget.style.backgroundColor = '#d4a800';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Reservation
          </Link>
          
          <Link 
            to="/my-booking" 
            style={{
              backgroundColor: 'transparent',
              color: colors.primary,
              fontWeight: '500',
              padding: '14px 28px',
              borderRadius: '10px',
              border: `2px solid ${colors.primary}`,
              textDecoration: 'none',
              fontSize: '14px',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              fontFamily: 'Poppins, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.mainBg;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = '';
              e.currentTarget.style.transform = '';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            My Bookings
          </Link>
          
          <Link 
            to="/" 
            style={{
              backgroundColor: 'transparent',
              color: colors.lightGray,
              fontWeight: '500',
              padding: '14px 28px',
              borderRadius: '10px',
              border: '1px solid #333',
              textDecoration: 'none',
              fontSize: '14px',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              fontFamily: 'Poppins, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.color = '';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;