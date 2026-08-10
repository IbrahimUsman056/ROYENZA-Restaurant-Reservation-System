import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ReservationTable from '../components/ReservationTable';
import { getParkingStats } from '../utils/ParkingManager';
import { getTableStats } from '../utils/TableManager';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#0a0a0a',
    cardBg: '#111111',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  // States
  const [bookings, setBookings] = useState([]);
  const [parkingStats, setParkingStats] = useState({ 
    cars: { total: 0, available: 0, occupied: 0 }, 
    bikes: { total: 0, available: 0, occupied: 0 } 
  });
  const [tableStats, setTableStats] = useState({});
  const [modalState, setModalState] = useState({
    show: false,
    type: '',
    bookingId: null
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check screen size for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 991);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('royneza_admin_logged_in');
    const username = localStorage.getItem('royneza_admin_username');
    
    if (!isLoggedIn) {
      navigate('/admin');
    } else {
      setAdminUsername(username || 'Admin');
      loadAllData();
    }
  }, [navigate]);

  // Load all data
  const loadAllData = () => {
    loadBookings();
    setParkingStats(getParkingStats());
    setTableStats(getTableStats());
  };

  // Fetch bookings from Express/MongoDB Backend
  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://royneza-backend.onrender.com/api/bookings/all', {
        method: 'GET',
        credentials: 'include' 
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setBookings(data.bookings);
      } else {
        console.error("Database returned error status:", data.message);
        if (response.status === 401) {
          localStorage.removeItem('royneza_admin_logged_in');
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error("Failed to fetch reservations from MongoDB:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingStats(getParkingStats());
      setTableStats(getTableStats());
      loadBookings();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle actions
  const handleAction = (type, bookingId) => {
    setModalState({ show: true, type, bookingId });
  };

  // Confirm database status actions (Confirm / Cancel / Pending / Delete)
  const confirmAction = async () => {
    let notificationMessage = '';
    let notificationType = '';
    const targetUrl = `https://royneza-backend.onrender.com/api/bookings/${modalState.bookingId}`;

    try {
      if (modalState.type === 'confirm') {
        const response = await fetch(`${targetUrl}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ status: 'Confirmed' }),
          credentials: 'include' 
        });

        if (!response.ok) throw new Error("Failed to confirm reservation.");
        notificationMessage = 'Booking confirmed successfully!';
        notificationType = 'success';

      } else if (modalState.type === 'pending') {
        const response = await fetch(`${targetUrl}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ status: 'Payment Pending' }),
          credentials: 'include'
        });

        if (!response.ok) throw new Error("Failed to set booking to pending.");
        notificationMessage = 'Booking set back to pending review.';
        notificationType = 'warning';

      } else if (modalState.type === 'cancel') {
        const response = await fetch(`${targetUrl}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ status: 'Cancelled' }),
          credentials: 'include'
        });

        if (!response.ok) throw new Error("Failed to cancel reservation.");

        // Clean up local system references for tables & parking
        const bookingToCancel = bookings.find(b => b.bookingId === modalState.bookingId);
        if (bookingToCancel) {
          if (bookingToCancel.status === 'Confirmed') {
            const tables = JSON.parse(localStorage.getItem('royneza_tables') || '{}');
            const lookupKey = bookingToCancel.tableType?.toLowerCase();
            const matchingKey = tables[bookingToCancel.tableType] ? bookingToCancel.tableType : lookupKey;
            
            if (tables[matchingKey]) {
              tables[matchingKey].available = Math.min(
                tables[matchingKey].available + 1, 
                tables[matchingKey].total
              );
              localStorage.setItem('royneza_tables', JSON.stringify(tables));
            }
          }
          if (bookingToCancel.needParking && bookingToCancel.parking) {
            const parkingSlots = JSON.parse(localStorage.getItem('royneza_parking_slots') || '{}');
            const typeSlots = bookingToCancel.parking.vehicleType === 'car' ? parkingSlots.cars : parkingSlots.bikes;
            if (typeSlots) {
              const slot = typeSlots.find(s => s.id === bookingToCancel.parking.parkingSlot);
              if (slot) {
                slot.status = 'available';
                slot.vehicleNumber = null;
                localStorage.setItem('royneza_parking_slots', JSON.stringify(parkingSlots));
              }
            }
          }
        }
        notificationMessage = 'Booking cancelled successfully!';
        notificationType = 'warning';

      } else if (modalState.type === 'delete') {
        const response = await fetch(targetUrl, { 
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Failed to remove reservation.");

        // Synchronize local asset states
        const bookingToDelete = bookings.find(b => b.bookingId === modalState.bookingId);
        if (bookingToDelete) {
          if (bookingToDelete.status === 'Confirmed') {
            const tables = JSON.parse(localStorage.getItem('royneza_tables') || '{}');
            const lookupKey = bookingToDelete.tableType?.toLowerCase();
            const matchingKey = tables[bookingToDelete.tableType] ? bookingToDelete.tableType : lookupKey;

            if (tables[matchingKey]) {
              tables[matchingKey].available++;
              localStorage.setItem('royneza_tables', JSON.stringify(tables));
            }
          }
          if (bookingToDelete.needParking && bookingToDelete.parking) {
            const parkingSlots = JSON.parse(localStorage.getItem('royneza_parking_slots') || '{}');
            const typeSlots = bookingToDelete.parking.vehicleType === 'car' ? parkingSlots.cars : parkingSlots.bikes;
            if (typeSlots) {
              const slot = typeSlots.find(s => s.id === bookingToDelete.parking.parkingSlot);
              if (slot) {
                slot.status = 'available';
                slot.vehicleNumber = null;
                localStorage.setItem('royneza_parking_slots', JSON.stringify(parkingSlots));
              }
            }
          }
        }
        notificationMessage = 'Booking deleted permanently!';
        notificationType = 'error';
      }

      showNotification(notificationMessage, notificationType);
    } catch (error) {
      console.error(`Error processing action ${modalState.type}:`, error);
      showNotification('Server sync failure. Action could not be finalized.', 'error');
    } finally {
      setModalState({ show: false, type: '', bookingId: null });
      loadAllData();
    }
  };

  // Handle WhatsApp Link Formatting (Using Localized PKR Formatter)
  const handleWhatsApp = (booking) => {
    if (!booking.whatsapp) return;
    const phoneNumber = booking.whatsapp.replace(/\D/g, '');
    
    // PKR Formatting Utility Rule 1.A
    const formattedPrice = new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(booking.payment?.amount || booking.totalPrice || 0);

    let message = `*ROYNEZA - Reservation ${booking.status.toUpperCase()}*\n\n` +
      `Dear ${booking.customerName || booking.name},\n\n` +
      `Booking Details:\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📋 ID: ${booking.bookingId}\n` +
      `📅 Date: ${booking.bookingDate}\n` +
      `🕐 Time: ${booking.startTime} - ${booking.endTime}\n` +
      `👥 Guests: ${booking.guests}\n` +
      `🍽️ Table: ${booking.tableType.toUpperCase()}\n` +
      `📊 Status: ${booking.status.toUpperCase()}\n`;
    
    if (booking.needParking && booking.parking) {
      message += `━━━━━━━━━━━━━━━\n` +
        `*Parking Details:*\n` +
        `🚗 Type: ${booking.parking.vehicleType === 'car' ? 'Car' : 'Bike'}\n` +
        `🔢 Number: ${booking.parking.vehicleNumber}\n` +
        `🅿️ Slot: ${booking.parking.parkingSlot}\n`;
    }
    
    if (booking.payment) {
      message += `━━━━━━━━━━━━━━━\n` +
        `*Payment Details:*\n` +
        `💳 Method: ${booking.payment.methodName || booking.payment.method || 'Online'}\n` +
        `💰 Amount: ${formattedPrice}\n` +
        `🧾 Txn ID: ${booking.payment.transactionId || 'N/A'}\n`;
    }
    
    message += `━━━━━━━━━━━━━━━\n\n` +
      `📞 Contact: +92 300 1234567\n\n` +
      `Best regards,\nRoyneza Restaurant`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // View transaction payment screenshot modal
  const handleViewScreenshot = (booking) => {
    if (booking.payment && (booking.payment.screenshot || booking.payment.screenshotPreview)) {
      setPaymentScreenshot(booking.payment.screenshot || booking.payment.screenshotPreview);
    } else {
      alert("No transaction screenshot attached to this reservation.");
    }
  };

  // Get modal metadata content configurations
  const getModalContent = () => {
    switch(modalState.type) {
      case 'confirm':
        return {
          title: 'Confirm Booking',
          message: 'Are you sure you want to approve and confirm this booking inside the database?',
          color: '#28a745',
          buttonText: 'Confirm Approval',
          icon: '✓'
        };
      case 'pending':
        return {
          title: 'Set to Pending',
          message: 'Are you sure you want to revert this reservation back to Payment Pending state?',
          color: '#ff9f43',
          buttonText: 'Set Pending',
          icon: '⏳'
        };
      case 'cancel':
        return {
          title: 'Cancel Booking',
          message: 'This will update status to Cancelled and free up allocated assets.',
          color: '#dc3545',
          buttonText: 'Cancel Booking',
          icon: '!'
        };
      case 'delete':
        return {
          title: 'Delete Booking',
          message: 'Warning: This will permanently remove the record document from MongoDB.',
          color: '#ff6b6b',
          buttonText: 'Delete Forever',
          icon: '×'
        };
      default:
        return {};
    }
  };

  const modalContent = getModalContent();

  return (
    <div style={{ backgroundColor: colors.mainBg, minHeight: '100vh' }}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #222',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ☰
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: colors.primary,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: colors.mainBg, fontSize: '14px', fontWeight: 'bold', fontFamily: 'Playfair Display, serif' }}>R</span>
            </div>
            <span style={{ color: colors.primary, fontSize: '16px', fontWeight: 'bold', fontFamily: 'Playfair Display, serif' }}>ROYNEZA</span>
          </div>
          
          <button
            onClick={loadAllData}
            style={{
              background: 'none',
              border: 'none',
              color: colors.lightGray,
              fontSize: '18px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ↻
          </button>
        </div>
      )}

      {/* Sidebar Component Reference */}
      <Sidebar 
        isMobile={isMobile} 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Container Layout */}
      <div style={{ 
          marginLeft: isMobile ? '0' : '280px', 
          padding: isMobile ? '70px 15px 20px 15px' : '30px',
          transition: 'all 0.3s ease'
        }}>
        {/* Top Bar Bar - Desktop variant */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            paddingBottom: '25px',
            borderBottom: '1px solid #222',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{ color: colors.white, fontFamily: 'Playfair Display, serif', fontSize: '32px', marginBottom: '5px' }}>
                Dashboard Overview
              </h1>
              <p style={{ color: colors.lightGray, fontSize: '14px', marginBottom: 0 }}>
                Logged into system ledger as: <span style={{ color: colors.primary }}>{adminUsername}</span>
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button onClick={loadAllData} style={refreshBtnStyle(colors)}>
                {isLoading ? '⌛ Syncing...' : '↻ Refresh Ledger'}
              </button>
              <div style={{
                backgroundColor: '#0a0a0a',
                borderRadius: '12px',
                padding: '12px 20px',
                border: '1px solid #222'
              }}>
                <span style={{ color: colors.lightGray, fontSize: '11px', display: 'block' }}>SYSTEM DATE</span>
                <span style={{ color: colors.white, fontSize: '14px', fontWeight: '500' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quantifiable Mini Metrics - Row 1 */}
        <div className="row" style={{ marginBottom: isMobile ? '15px' : '30px' }}>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="Total Orders" value={bookings.length} color="#F5BD02" icon="📋" />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="Pending Review" value={bookings.filter(b => b.status === 'Payment Pending' || b.status === 'Pending').length} color="#ff9f43" icon="⏳" />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="Confirmed" value={bookings.filter(b => b.status === 'Confirmed').length} color="#28a745" icon="✅" />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="Cancelled" value={bookings.filter(b => b.status === 'Cancelled').length} color="#dc3545" icon="❌" />
          </div>
        </div>

        {/* Dynamic Infrastructure Metrics - Row 2 */}
        <div className="row" style={{ marginBottom: isMobile ? '15px' : '30px' }}>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="Car Slots" value={`${parkingStats.cars?.available || 0}/${parkingStats.cars?.total || 0}`} color="#007bff" icon="🚗" />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="Bike Slots" value={`${parkingStats.bikes?.available || 0}/${parkingStats.bikes?.total || 0}`} color="#17a2b8" icon="🏍️" />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="VIP Dining" value={`${tableStats.vip?.available || 0}/${tableStats.vip?.total || 0}`} color="#ffc107" icon="⭐" />
          </div>
          <div className="col-6 col-md-3 mb-3">
            <MiniStatCard title="Outdoor Terrace" value={`${tableStats.outdoor?.available || 0}/${tableStats.outdoor?.total || 0}`} color="#28a745" icon="🌿" />
          </div>
        </div>

        {/* Table Availability Matrix Grid */}
        {!isMobile && (
          <div style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '25px',
            border: '1px solid #222',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: colors.white, fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: '20px' }}>
              Live Table Type Availability Map
            </h3>
            <div className="row">
              {Object.entries(tableStats).map(([type, info]) => (
                <div key={type} className="col-6 col-md-2 mb-3">
                  <div style={{
                    backgroundColor: '#111',
                    borderRadius: '12px',
                    padding: '15px',
                    border: '1px solid #222',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: info.available > 0 ? '#28a745' : '#dc3545',
                      margin: '0 auto 8px'
                    }}></div>
                    <div style={{ color: colors.white, fontSize: '11px', textTransform: 'capitalize', marginBottom: '4px' }}>{type}</div>
                    <div style={{ color: info.available > 0 ? '#28a745' : '#dc3545', fontSize: '18px', fontWeight: '700' }}>{info.available}</div>
                    <div style={{ color: '#666', fontSize: '10px' }}>/ {info.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Loading Spinner / Skeleton Feedback Loop - Rule 2 */}
        {isLoading ? (
          <div style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '60px 20px',
            border: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <div className="custom-spinner" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(245, 189, 2, 0.1)',
              borderTopColor: colors.primary,
              animation: 'spinAround 0.8s linear infinite'
            }}></div>
            <p style={{ color: colors.lightGray, fontSize: '14px', margin: 0, letterSpacing: '0.5px' }} className="animate-pulse">
              Syncing live operational ledger from MongoDB...
            </p>
          </div>
        ) : (
          /* Sub-table Wrapper Element rendered when complete */
          <ReservationTable 
            bookings={bookings}
            onConfirm={(id) => handleAction('confirm', id)}
            onPending={(id) => handleAction('pending', id)}
            onCancel={(id) => handleAction('cancel', id)}
            onDelete={(id) => handleAction('delete', id)}
            onWhatsApp={handleWhatsApp}
            onViewScreenshot={handleViewScreenshot}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Payment Screenshot Viewer Modal */}
      {paymentScreenshot && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          padding: '20px',
          cursor: 'pointer'
        }}
        onClick={() => setPaymentScreenshot(null)}>
          <img
            src={paymentScreenshot}
            alt="Payment Receipt Screenshot"
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              borderRadius: '15px',
              border: '2px solid #333'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setPaymentScreenshot(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Notification Banner Popup */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: isMobile ? '70px' : '30px',
          right: isMobile ? '15px' : '30px',
          left: isMobile ? '15px' : 'auto',
          backgroundColor: notification.type === 'success' ? '#28a745' : 
                          notification.type === 'warning' ? '#F5BD02' : '#dc3545',
          color: notification.type === 'warning' ? '#000' : '#fff',
          padding: '14px 20px',
          borderRadius: '12px',
          fontWeight: '500',
          fontSize: '14px',
          zIndex: 10000,
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          textAlign: 'center',
          animation: 'slideIn 0.3s ease'
        }}>
          {notification.message}
        </div>
      )}

      {/* Action Processing Overlay Modal */}
      {modalState.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: isMobile ? '25px' : '40px',
            border: '1px solid #222',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: `${modalContent.color}15`,
              border: `2px solid ${modalContent.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              fontSize: '28px',
              color: modalContent.color,
              fontWeight: 'bold'
            }}>
              {modalContent.icon}
            </div>
            
            <h3 style={{ color: colors.white, fontFamily: 'Playfair Display, serif', fontSize: isMobile ? '20px' : '24px', marginBottom: '10px' }}>
              {modalContent.title}
            </h3>
            <p style={{ color: colors.lightGray, fontSize: '13px', marginBottom: '15px' }}>
              {modalContent.message}
            </p>
            <p style={{ color: colors.primary, fontFamily: 'monospace', fontSize: '13px', marginBottom: '20px' }}>
              Tracking Identifier: {modalState.bookingId}
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setModalState({ show: false, type: '', bookingId: null })}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.white,
                  padding: '10px 25px',
                  borderRadius: '10px',
                  border: '1px solid #333',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Go Back
              </button>
              
              <button
                onClick={confirmAction}
                style={{
                  backgroundColor: modalContent.color,
                  color: '#fff',
                  padding: '10px 25px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {modalContent.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Animation Frames */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spinAround {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Mini Stat Card Internal Component
const MiniStatCard = ({ title, value, color, icon }) => {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}10, ${color}05)`,
      borderRadius: '14px',
      padding: '18px 15px',
      border: `1px solid ${color}25`,
      height: '100%',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#888', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase' }}>{title}</span>
        <span style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      <div style={{ color: color, fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif' }}>{value}</div>
    </div>
  );
};

// Helper Refresh Style Constructor
const refreshBtnStyle = (colors) => ({
  backgroundColor: 'transparent',
  border: '1px solid #333',
  color: colors.lightGray,
  padding: '10px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '13px',
  transition: 'all 0.3s ease',
  fontFamily: 'Poppins, sans-serif'
});

export default Dashboard;