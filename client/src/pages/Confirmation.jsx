import React, { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const receiptRef = useRef(null);

  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  // Format table type
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

  // Format date safely
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

  // Handle print receipt smoothly
  const handlePrint = () => {
    window.print();
  };

  // Pre-generate static barcode lines to prevent layout shift on updates
  const barcodeLines = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      height: `${Math.floor(Math.random() * 30) + 20}px`
    }));
  }, []);

  // If no booking data found
  if (!booking) {
    return (
      <div style={{
        backgroundColor: colors.mainBg,
        minHeight: '100vh',
        padding: '120px 0 50px 0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', maxWidth: '450px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              border: '2px solid #333'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h2 style={{ color: colors.white, fontFamily: 'Playfair Display, serif', marginBottom: '15px', fontSize: '28px' }}>
              No Booking Found
            </h2>
            <p style={{ color: colors.lightGray, marginBottom: '30px', fontSize: '15px', lineHeight: '1.6' }}>
              Please make a reservation first to see the confirmation summary.
            </p>
            <Link to="/reservation" className="btn" style={{
              backgroundColor: colors.primary,
              color: colors.mainBg,
              fontWeight: '600',
              padding: '15px 35px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '15px',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(245, 189, 2, 0.2)'
            }}>
              Make a Reservation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: colors.mainBg,
      minHeight: '100vh',
      padding: '120px 0 50px 0'
    }}>
      <div className="container">
        {/* Printable Area Wrapper */}
        <div ref={receiptRef} className="printable-receipt" style={{ maxWidth: '700px', margin: '0 auto', padding: '0 15px' }}>
          
          {/* Receipt Card */}
          <div style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '50px 40px',
            border: '2px solid #222',
            position: 'relative',
            overflow: 'hidden'
          }}>
            
            {/* Watermark */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: '120px',
              color: 'rgba(255, 255, 255, 0.02)',
              fontWeight: 'bold',
              pointerEvents: 'none',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '20px',
              whiteSpace: 'nowrap',
              zIndex: 0
            }}>
              ROYENZA
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              
              {/* Receipt Header */}
              <div style={{
                textAlign: 'center',
                marginBottom: '35px',
                paddingBottom: '25px',
                borderBottom: '2px dashed #222'
              }}>
                {/* Logo layout */}
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
                    }}>
                      R
                    </span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h2 style={{ 
                      color: colors.primary, 
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '28px',
                      letterSpacing: '4px',
                      marginBottom: '2px',
                      marginTop: 0
                    }}>
                      ROYENZA
                    </h2>
                    <p style={{ 
                      color: colors.lightGray, 
                      fontSize: '11px',
                      letterSpacing: '6px',
                      textTransform: 'uppercase',
                      margin: 0
                    }}>
                      Fine Dining
                    </p>
                  </div>
                </div>

                <h3 style={{ 
                  color: colors.white, 
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '22px',
                  marginBottom: '5px',
                  marginTop: 0
                }}>
                  {booking.status === 'Confirmed' ? 'RESERVATION CONFIRMED' : 
                   booking.status === 'Cancelled' ? 'RESERVATION CANCELLED' : 
                   'RESERVATION PENDING'}
                </h3>
                <p style={{ color: colors.lightGray, fontSize: '13px', margin: 0 }}>
                  Receipt #{booking.bookingId}
                </p>
              </div>

              {/* Status Banner */}
              <div style={{
                backgroundColor: booking.status === 'Confirmed' ? 'rgba(40, 167, 69, 0.08)' : 
                                booking.status === 'Cancelled' ? 'rgba(220, 53, 69, 0.08)' : 'rgba(245, 189, 2, 0.08)',
                border: `1px solid ${booking.status === 'Confirmed' ? 'rgba(40, 167, 69, 0.2)' : 
                                       booking.status === 'Cancelled' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(245, 189, 2, 0.2)'}`,
                borderRadius: '12px',
                padding: '15px 20px',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                <span style={{
                  color: booking.status === 'Confirmed' ? '#28a745' : 
                         booking.status === 'Cancelled' ? '#dc3545' : colors.primary,
                  fontWeight: '600',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: booking.status === 'Confirmed' ? '#28a745' : 
                                    booking.status === 'Cancelled' ? '#dc3545' : colors.primary
                  }}></span>
                  {booking.status === 'Confirmed' ? 'YOUR TABLE IS RESERVED' : 
                   booking.status === 'Cancelled' ? 'THIS BOOKING HAS BEEN CANCELLED' : 
                   'AWAITING CONFIRMATION'}
                </span>
                {booking.status === 'Pending' && (
                  <p style={{ color: colors.lightGray, fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                    You will be notified when a table becomes available
                  </p>
                )}
              </div>

              {/* Customer Information Section */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{
                  color: colors.primary,
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  marginBottom: '10px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #222',
                  marginTop: 0
                }}>
                  CUSTOMER INFORMATION
                </h4>
                <ReceiptRow label="Name" value={booking.customerName} />
                <ReceiptRow label="Email" value={booking.email} />
                <ReceiptRow label="Phone" value={booking.phone} />
                {booking.whatsapp && <ReceiptRow label="WhatsApp" value={booking.whatsapp} />}
              </div>

              {/* Reservation Details Section */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{
                  color: colors.primary,
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  marginBottom: '10px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #222',
                  marginTop: 0
                }}>
                  RESERVATION DETAILS
                </h4>
                <ReceiptRow label="Date" value={formatDate(booking.bookingDate)} highlight />
                <ReceiptRow label="Time" value={`${booking.startTime} - ${booking.endTime}`} />
                <ReceiptRow label="Guests" value={`${booking.guests} ${booking.guests > 1 ? 'Persons' : 'Person'}`} />
                <ReceiptRow label="Table Type" value={formatTableType(booking.tableType)} />
                <ReceiptRow label="Booking ID" value={booking.bookingId} mono />
              </div>

              {/* Parking Details Section */}
              {booking.needParking && booking.parking && (
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{
                    color: colors.primary,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    marginBottom: '10px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #222',
                    marginTop: 0
                  }}>
                    PARKING DETAILS
                  </h4>
                  <ReceiptRow label="Vehicle Type" value={booking.parking.vehicleType === 'car' ? 'Car' : 'Bike'} />
                  <ReceiptRow label="Vehicle Number" value={booking.parking.vehicleNumber} highlight />
                  {booking.parking.vehicleModel && <ReceiptRow label="Model" value={booking.parking.vehicleModel} />}
                  {booking.parking.vehicleColor && <ReceiptRow label="Color" value={booking.parking.vehicleColor} />}
                  
                  {/* Assigned Parking Slot */}
                  {booking.parking.parkingSlot && (
                    <div style={{
                      backgroundColor: 'rgba(245, 189, 2, 0.05)',
                      border: '1px solid rgba(245, 189, 2, 0.2)',
                      borderRadius: '10px',
                      padding: '15px',
                      marginTop: '15px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 5px 0' }}>
                        Assigned Parking Slot
                      </p>
                      <p style={{ color: colors.primary, fontSize: '32px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '3px', margin: 0 }}>
                        {booking.parking.parkingSlot}
                      </p>
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
                {booking.createdAt && (
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>
                    Booking created on {new Date(booking.createdAt).toLocaleString()}
                  </p>
                )}
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>
                  For any queries, contact us at +92 300 1234567
                </p>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: 0, marginTop: 0 }}>
                  Please arrive 10 minutes before your reservation time
                </p>
              </div>

              {/* Barcode Decoration */}
              <div style={{
                marginTop: '35px',
                display: 'flex',
                justifyContent: 'center',
                gap: '3px'
              }}>
                {barcodeLines.map((line) => (
                  <div key={line.id} style={{
                    width: '3px',
                    height: line.height,
                    backgroundColor: '#222',
                    borderRadius: '1px'
                  }}></div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Action Buttons Section (Hidden when printing via CSS class targeting) */}
        <div className="action-buttons" style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Print Button */}
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: 'transparent',
              color: colors.white,
              fontWeight: '500',
              padding: '14px 28px',
              borderRadius: '10px',
              border: '1px solid #333',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = colors.white;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 12H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print Receipt
          </button>

          {/* New Reservation */}
          <Link
            to="/reservation"
            style={{
              backgroundColor: colors.primary,
              color: colors.mainBg,
              fontWeight: '600',
              padding: '14px 28px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 189, 2, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Reservation
          </Link>

          {/* My Bookings */}
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
              transition: 'all 0.3s ease',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.mainBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.primary;
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

          {/* Home */}
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
              transition: 'all 0.3s ease',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = colors.lightGray;
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

      {/* Optimized Print Stylesheet */}
      <style>
        {`
          @media print {
            body {
              background: #ffffff !important;
              color: #000000 !important;
            }
            body * {
              visibility: hidden;
            }
            .printable-receipt, .printable-receipt * {
              visibility: visible;
            }
            .printable-receipt {
              position: absolute;
              left: 50%;
              top: 20px;
              transform: translateX(-50%);
              width: 100%;
              max-width: 650px;
            }
            .action-buttons {
              display: none !important;
            }
            @page {
              margin: 15mm;
              size: portrait;
            }
          }
        `}
      </style>
    </div>
  );
};

// Receipt Row Component
const ReceiptRow = ({ label, value, highlight, mono }) => {
  if (!value) return null; // Defensive check to hide row completely if missing data

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
        {value}
      </span>
    </div>
  );
};

export default Confirmation;