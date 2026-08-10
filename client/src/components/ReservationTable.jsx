import React, { useState } from 'react';

const ReservationTable = ({ bookings, onConfirm, onPending, onCancel, onDelete, onWhatsApp }) => {
  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed':
        return { 
          backgroundColor: '#28a74515',
          color: '#28a745',
          border: '1px solid #28a74530',
          text: 'CONFIRMED',
          dot: '#28a745'
        };
      case 'Cancelled':
        return { 
          backgroundColor: '#dc354515',
          color: '#dc3545',
          border: '1px solid #dc354530',
          text: 'CANCELLED',
          dot: '#dc3545'
        };
      case 'Payment Pending':
        return { 
          backgroundColor: '#F5BD0215',
          color: '#F5BD02',
          border: '1px solid #F5BD0230',
          text: 'PAYMENT PENDING',
          dot: '#F5BD02'
        };
      default:
        return { 
          backgroundColor: '#F5BD0215',
          color: '#F5BD02',
          border: '1px solid #F5BD0230',
          text: 'PENDING',
          dot: '#F5BD02'
        };
    }
  };

  // Filter bookings based on status and search
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      booking.bookingId.toLowerCase().includes(searchLower) ||
      booking.customerName.toLowerCase().includes(searchLower) ||
      booking.phone.includes(searchTerm) ||
      (booking.parking && booking.parking.vehicleNumber?.toLowerCase().includes(searchLower));
    
    return matchesStatus && (searchTerm === '' || matchesSearch);
  });

  // Status tabs
  const statusTabs = ['All', 'Payment Pending', 'Pending', 'Confirmed', 'Cancelled'];

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid #222'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h3 style={{ 
            color: colors.white, 
            fontFamily: 'Playfair Display, serif',
            fontSize: '24px',
            marginBottom: '8px'
          }}>
            Reservations
          </h3>
          <p style={{ color: colors.lightGray, fontSize: '13px', marginBottom: 0 }}>
            Manage all restaurant bookings
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookings..."
              style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                color: colors.white,
                padding: '10px 16px 10px 40px',
                borderRadius: '10px',
                fontSize: '13px',
                width: '220px',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'Poppins, sans-serif'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = '0 0 0 3px rgba(245, 189, 2, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333';
                e.target.style.boxShadow = 'none';
              }}
            />
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#666" 
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          {/* Total Count Badge */}
          <div style={{
            backgroundColor: '#111',
            borderRadius: '10px',
            padding: '10px 16px',
            border: '1px solid #333'
          }}>
            <span style={{ color: colors.lightGray, fontSize: '12px' }}>Total: </span>
            <span style={{ color: colors.primary, fontWeight: '600', fontSize: '14px' }}>
              {filteredBookings.length}
            </span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {statusTabs.map((status) => {
          const isActive = filterStatus === status;
          const count = status === 'All' 
            ? bookings.length 
            : bookings.filter(b => b.status === status).length;
          
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: isActive ? `1px solid ${colors.primary}` : '1px solid #333',
                backgroundColor: isActive ? '#F5BD0210' : 'transparent',
                color: isActive ? colors.primary : colors.lightGray,
                fontWeight: isActive ? '600' : '400',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Poppins, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.borderColor = '#555';
                  e.target.style.color = colors.white;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.borderColor = '#333';
                  e.target.style.color = colors.lightGray;
                }
              }}
            >
              {status === 'Payment Pending' ? 'Pay Pending' : status}
              <span style={{
                backgroundColor: isActive ? colors.primary : '#333',
                color: isActive ? colors.mainBg : colors.lightGray,
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px'
        }}>
          <thead>
            <tr>
              <th style={headerStyle}>Booking ID</th>
              <th style={headerStyle}>Customer</th>
              <th style={headerStyle}>Contact</th>
              <th style={headerStyle}>Date & Time</th>
              <th style={headerStyle}>Details</th>
              <th style={headerStyle}>Parking</th>
              <th style={headerStyle}>Payment</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '60px 20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      border: '1px solid #333'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <h4 style={{ color: colors.white, marginBottom: '8px', fontSize: '18px' }}>
                      No Reservations Found
                    </h4>
                    <p style={{ color: colors.lightGray, fontSize: '13px' }}>
                      {searchTerm 
                        ? 'No bookings match your search criteria' 
                        : 'There are no reservations yet'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking, index) => {
                const statusBadge = getStatusBadge(booking.status);
                
                return (
                  <tr key={index} style={{
                    backgroundColor: '#0d0d0d',
                    transition: 'all 0.3s ease',
                    borderRadius: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#111';
                    e.currentTarget.style.transform = 'scale(1.002)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0d0d0d';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}>
                    {/* Booking ID */}
                    <td style={cellStyle}>
                      <div>
                        <span style={{
                          color: colors.primary,
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '0.5px'
                        }}>
                          {booking.bookingId}
                        </span>
                        <br />
                        <span style={{ color: '#666', fontSize: '11px' }}>
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: '#F5BD0210',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #F5BD0230',
                          flexShrink: 0
                        }}>
                          <span style={{ color: colors.primary, fontSize: '14px', fontWeight: '600' }}>
                            {booking.customerName ? booking.customerName.charAt(0) : '?'}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: colors.white, fontSize: '13px', fontWeight: '500', display: 'block' }}>
                            {booking.customerName}
                          </span>
                          <span style={{ color: '#666', fontSize: '11px' }}>
                            {booking.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={cellStyle}>
                      <div>
                        <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block' }}>
                          {booking.phone}
                        </span>
                        <span style={{ color: '#666', fontSize: '11px' }}>
                          WhatsApp: {booking.whatsapp}
                        </span>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td style={cellStyle}>
                      <div>
                        <span style={{ color: colors.white, fontSize: '13px', display: 'block' }}>
                          {booking.bookingDate}
                        </span>
                        <span style={{ color: '#666', fontSize: '11px' }}>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </td>

                    {/* Details */}
                    <td style={cellStyle}>
                      <div>
                        <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block' }}>
                          {booking.guests} {booking.guests > 1 ? 'guests' : 'guest'}
                        </span>
                        <span style={{ color: '#666', fontSize: '11px', textTransform: 'capitalize' }}>
                          {booking.tableType}
                        </span>
                      </div>
                    </td>

                    {/* Parking */}
                    <td style={cellStyle}>
                      {booking.needParking && booking.parking ? (
                        <div style={{
                          backgroundColor: '#007bff10',
                          border: '1px solid #007bff30',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          display: 'inline-block'
                        }}>
                          <span style={{ color: '#007bff', fontSize: '11px', fontWeight: '500', display: 'block' }}>
                            Slot {booking.parking.parkingSlot}
                          </span>
                          <span style={{ color: '#666', fontSize: '10px' }}>
                            {booking.parking.vehicleNumber}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#666', fontSize: '12px' }}>No Parking</span>
                      )}
                    </td>

                    {/* Payment Status */}
                    <td style={cellStyle}>
                      {booking.payment ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {booking.payment.screenshot ? (
                            <button
                              onClick={() => {
                                const win = window.open('', '_blank', 'width=800,height=600');
                                win.document.write(`
                                  <html>
                                    <head>
                                      <title>Payment Screenshot - ${booking.bookingId}</title>
                                      <style>
                                        body { margin:0; background:#000; display:flex; align-items:center; justify-content:center; min-height:100vh; }
                                        img { max-width:90%; max-height:90vh; border-radius:10px; border:2px solid #333; cursor:zoom-out; }
                                        .close-btn { position:fixed; top:20px; right:20px; background:#dc3545; color:white; border:none; border-radius:50%; width:40px; height:40px; font-size:20px; cursor:pointer; z-index:1000; }
                                        .info { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); color:#888; font-family:sans-serif; font-size:12px; background:rgba(0,0,0,0.8); padding:8px 16px; border-radius:20px; }
                                      </style>
                                    </head>
                                    <body>
                                      <button class="close-btn" onclick="window.close()">×</button>
                                      <img src="${booking.payment.screenshot}" alt="Payment Screenshot" />
                                      <div class="info">Booking ID: ${booking.bookingId} | Press ESC to close</div>
                                      <script>
                                        document.addEventListener('keydown', function(e) { if (e.key === 'Escape') window.close(); });
                                      </script>
                                    </body>
                                  </html>
                                `);
                              }}
                              style={{
                                backgroundColor: '#8B5CF620',
                                border: '1px solid #8B5CF640',
                                color: '#8B5CF6',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#8B5CF6';
                                e.target.style.color = '#fff';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#8B5CF620';
                                e.target.style.color = '#8B5CF6';
                              }}
                              title="View Payment Screenshot"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                              </svg>
                              View
                            </button>
                          ) : (
                            <span style={{
                              backgroundColor: '#8B5CF615',
                              border: '1px solid #8B5CF630',
                              color: '#8B5CF6',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              {booking.payment.methodName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#666', fontSize: '12px' }}>Not Paid</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={cellStyle}>
                      <span style={{
                        backgroundColor: statusBadge.backgroundColor,
                        color: statusBadge.color,
                        border: statusBadge.border,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: statusBadge.dot
                        }}></span>
                        {statusBadge.text}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Confirm Button (Show if Pending or Payment Pending) */}
                        {(booking.status === 'Pending' || booking.status === 'Payment Pending') && (
                          <button
                            onClick={() => onConfirm(booking.bookingId)}
                            style={actionButtonStyle('#28a745')}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#28a745';
                              e.currentTarget.style.color = '#fff';
                              e.currentTarget.style.borderColor = '#28a745';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#28a745';
                              e.currentTarget.style.borderColor = '#28a74530';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title="Confirm Booking"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        )}

                        {/* Revert to Pending Button (Show if Confirmed or Cancelled) */}
                        {(booking.status === 'Confirmed' || booking.status === 'Cancelled') && (
                          <button
                            onClick={() => onPending(booking.bookingId)}
                            style={actionButtonStyle('#ff9f43')}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#ff9f43';
                              e.currentTarget.style.color = '#fff';
                              e.currentTarget.style.borderColor = '#ff9f43';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#ff9f43';
                              e.currentTarget.style.borderColor = '#ff9f4330';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title="Set to Payment Pending"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                          </button>
                        )}

                        {/* Cancel Button (Show if anything except Cancelled) */}
                        {booking.status !== 'Cancelled' && (
                          <button
                            onClick={() => onCancel(booking.bookingId)}
                            style={actionButtonStyle('#dc3545')}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#dc3545';
                              e.currentTarget.style.color = '#fff';
                              e.currentTarget.style.borderColor = '#dc3545';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#dc3545';
                              e.currentTarget.style.borderColor = '#dc354530';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title="Cancel Booking"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(booking.bookingId)}
                          style={actionButtonStyle('#ff6b6b')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ff6b6b';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.borderColor = '#ff6b6b';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#ff6b6b';
                            e.currentTarget.style.borderColor = '#ff6b6b30';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          title="Delete Booking Permanently"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          </svg>
                        </button>

                        {/* WhatsApp Button */}
                        <button
                          onClick={() => onWhatsApp(booking)}
                          style={actionButtonStyle('#25D366')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#25D366';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.borderColor = '#25D366';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#25D366';
                            e.currentTarget.style.borderColor = '#25D36630';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          title="WhatsApp Customer"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      {filteredBookings.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #222',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <span style={{ color: '#666', fontSize: '12px' }}>
            Showing {filteredBookings.length} of {bookings.length} reservations
          </span>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusDot color="#28a745" label="Confirmed" count={bookings.filter(b => b.status === 'Confirmed').length} />
            <StatusDot color="#F5BD02" label="Pending" count={bookings.filter(b => b.status === 'Pending' || b.status === 'Payment Pending').length} />
            <StatusDot color="#dc3545" label="Cancelled" count={bookings.filter(b => b.status === 'Cancelled').length} />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatusDot = ({ color, label, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: color
    }}></span>
    <span style={{ color: '#666', fontSize: '11px' }}>{label}</span>
    <span style={{ color: '#999', fontSize: '11px', fontWeight: '500' }}>{count}</span>
  </div>
);

// Styles
const headerStyle = {
  color: '#888',
  padding: '12px 16px',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  borderBottom: '2px solid #222',
  backgroundColor: 'transparent',
  fontFamily: 'Poppins, sans-serif'
};

const cellStyle = {
  padding: '16px',
  borderBottom: '1px solid #1a1a1a',
  fontSize: '13px'
};

const actionButtonStyle = (color) => ({
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: `1px solid ${color}30`,
  backgroundColor: 'transparent',
  color: color,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  fontSize: '14px'
});

export default ReservationTable;