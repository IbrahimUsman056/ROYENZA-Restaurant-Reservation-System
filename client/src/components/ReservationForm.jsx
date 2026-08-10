import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import images from '../assets/images/ImageData';
import { getAvailableParkingSlots, assignParkingSlot, freeParkingSlot, getParkingStats } from '../utils/ParkingManager';
import { checkTableAvailability, bookTable, freeTable, getAvailableTables } from '../utils/TableManager';
import PaymentModal from './PaymentModal';

const ReservationForm = () => {
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

  // States for parking and table availability
  const [parkingStats, setParkingStats] = useState({ 
    cars: { total: 0, available: 0, occupied: 0 }, 
    bikes: { total: 0, available: 0, occupied: 0 } 
  });
  const [tableAvailability, setTableAvailability] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  // Load parking and table stats on mount and refresh every 10 seconds
  useEffect(() => {
    setParkingStats(getParkingStats());
    setTableAvailability(getAvailableTables());
    
    const interval = setInterval(() => {
      setParkingStats(getParkingStats());
      setTableAvailability(getAvailableTables());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    guests: 1,
    tableType: 'standard',
    needParking: false,
    vehicleType: 'car',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleColor: '',
  });

  // State for form errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate Phone
    const phoneRegex = /^\d{11}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 11-digit phone number';
    }

    // Validate WhatsApp
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid 11-digit WhatsApp number';
    }

    // Validate Date
    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Booking date is required';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.bookingDate = 'Date cannot be in the past';
      }
    }

    // Validate Start Time
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    // Validate End Time
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Validate Guests
    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest required';
    } else if (formData.guests > 20) {
      newErrors.guests = 'Maximum 20 guests allowed';
    }

    // Validate Parking fields if parking is selected
    if (formData.needParking) {
      if (!formData.vehicleNumber.trim()) {
        newErrors.vehicleNumber = 'Vehicle number is required';
      }
      if (!formData.vehicleModel.trim()) {
        newErrors.vehicleModel = 'Vehicle model is required';
      }
      if (!formData.vehicleColor.trim()) {
        newErrors.vehicleColor = 'Vehicle color is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Handle form submission - Opens Payment Modal
  const handleSubmit = async (e) => { // Added async keyword
    e.preventDefault();
    if (!validateForm()) {
      const firstError = document.querySelector('small[style*="color: rgb(220, 53, 69)"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingId = 'RNZ' + Date.now().toString().slice(-8);
      let assignedParkingSlot = null;

      // Check table availability via local manager (or replace with an API call)
      const tableAvailable = checkTableAvailability(formData.tableType);
      if (!tableAvailable) {
        setErrors(prev => ({
          ...prev,
          submit: `Sorry, no ${formData.tableType} tables available. Please select a different table type.`
        }));
        setIsSubmitting(false);
        return;
      }
      
      // Handle parking allocations locally for now
      if (formData.needParking) {
        const availableSlots = getAvailableParkingSlots(formData.vehicleType);
        if (availableSlots.length === 0) {
          setErrors(prev => ({
            ...prev,
            parking: `No parking slots available for ${formData.vehicleType}s.`
          }));
          setIsSubmitting(false);
          return;
        }
        
        assignedParkingSlot = assignParkingSlot(formData.vehicleType, formData.vehicleNumber);
        if (!assignedParkingSlot) {
          setErrors(prev => ({ ...prev, parking: 'Failed to assign parking slot.' }));
          setIsSubmitting(false);
          return;
        }
      }
      
      const tableBooked = bookTable(formData.tableType);
      if (!tableBooked) {
        if (assignedParkingSlot) freeParkingSlot(formData.vehicleType, assignedParkingSlot);
        setErrors(prev => ({ ...prev, submit: 'Failed to reserve table.' }));
        setIsSubmitting(false);
        return;
      }
      
      // Constructing our unified tracking schema 
      const booking = {
        bookingId: bookingId,
        customerName: formData.fullName, // Stores explicit name entry
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        guests: formData.guests,
        tableType: formData.tableType,
        needParking: formData.needParking,
        status: 'Payment Pending',
        ...(formData.needParking && assignedParkingSlot && {
          parking: {
            vehicleType: formData.vehicleType,
            vehicleNumber: formData.vehicleNumber,
            vehicleModel: formData.vehicleModel,
            vehicleColor: formData.vehicleColor,
            parkingSlot: assignedParkingSlot,
          }
        }),
        createdAt: new Date().toISOString()
      };

      // --- BACKEND HOOK OPTION A (Optional Pre-save) ---
      // If you want your database to know about initialized bookings immediately:
      // await fetch('https://royneza-backend.onrender.com/api/bookings/pre-reserve', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(booking)
      // });

      // Staging internally for PaymentModal processing
      setPendingBooking(booking);
      setShowPayment(true);
    } catch (error) {
      console.error('Booking pre-save failed:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to process booking sequence.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

// Handle payment completion - Commits confirmed record to MongoDB
const handlePaymentComplete = async (paymentData) => {
    setIsSubmitting(true);
    // Clear any previous submit errors before starting
    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      const finalBookingPayload = {
        ...pendingBooking,
        status: 'Confirmed',
        payment: paymentData
      };

      console.log("Sending final payload to backend...", finalBookingPayload);

      // Making the API call to your Express backend
      const response = await fetch('https://royenza-restaurant-reservation-system.onrender.com/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalBookingPayload),
      });

      // 1. Check if the response type is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      let data = {};
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If it's HTML, extract text for debugging (tells us if it's a 413, 404, or 500 error)
        const errorText = await response.text();
        console.error(`Server returned non-JSON response (${response.status}):`, errorText);
        
        if (response.status === 413) {
          throw new Error("The payment screenshot image size is too large for the server. Please try compressing your image or uploading a smaller file.");
        }
        throw new Error(`Server Error (${response.status}). Please check if your backend server is running.`);
      }

      if (response.ok) {
        setShowPayment(false);
        // Navigate to confirmation page, sending backend database document instance
        navigate('/confirmation', { state: { booking: data.booking || finalBookingPayload } });
      } else {
        throw new Error(data.message || 'Server rejected booking confirmation.');
      }
    } catch (error) {
      console.error('Failed to commit booking to database:', error);
      
      // 2. Display the actual explicit error message on your UI form instead of a generic message
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Payment processed but booking confirmation failed. Please contact support.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment cancellation
  const handlePaymentClose = () => {
    setShowPayment(false);
    
    // Remove the booking
    const allBookings = JSON.parse(localStorage.getItem('royneza_bookings') || '[]');
    const filtered = allBookings.filter(b => b.bookingId !== pendingBooking.bookingId);
    localStorage.setItem('royneza_bookings', JSON.stringify(filtered));
    
    // Free up table and parking
    if (pendingBooking) {
      if (pendingBooking.needParking && pendingBooking.parking) {
        freeParkingSlot(pendingBooking.parking.vehicleType, pendingBooking.parking.parkingSlot);
      }
      freeTable(pendingBooking.tableType);
    }
    
    setPendingBooking(null);
  };

  // Input field style
  const inputStyle = {
    backgroundColor: colors.cardBg,
    border: `1px solid #333`,
    color: colors.white,
    padding: '14px 16px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif'
  };

  // Label style
  const labelStyle = {
    color: colors.white,
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{
      backgroundColor: colors.mainBg,
      minHeight: '100vh',
      padding: '120px 0 50px 0'
    }}>
      <div className="container">
        <div className="row">
          {/* Left Side - Image Section */}
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div style={{ position: 'sticky', top: '120px' }}>
              {/* Main Image */}
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: `2px solid ${colors.primary}`,
                marginBottom: '20px'
              }}>
                <img
                  src={images.interior2}
                  alt="Restaurant Ambiance"
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Info Card */}
              <div style={{
                backgroundColor: colors.secondaryBg,
                borderRadius: '15px',
                padding: '25px',
                border: `1px solid ${colors.primary}`
              }}>
                <h4 style={{ 
                  color: colors.primary, 
                  fontFamily: 'Playfair Display, serif',
                  marginBottom: '20px',
                  fontSize: '20px'
                }}>
                  Why Reserve at Royenza?
                </h4>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <span style={{ color: colors.mainBg, fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    </div>
                    <div>
                      <h6 style={{ color: colors.white, marginBottom: '4px', fontSize: '14px' }}>Priority Seating</h6>
                      <p style={{ color: colors.lightGray, fontSize: '13px', marginBottom: 0 }}>
                        Get the best table in the house with advance reservation
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <span style={{ color: colors.mainBg, fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    </div>
                    <div>
                      <h6 style={{ color: colors.white, marginBottom: '4px', fontSize: '14px' }}>Guaranteed Parking</h6>
                      <p style={{ color: colors.lightGray, fontSize: '13px', marginBottom: 0 }}>
                        Reserve your parking slot along with your table
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <span style={{ color: colors.mainBg, fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    </div>
                    <div>
                      <h6 style={{ color: colors.white, marginBottom: '4px', fontSize: '14px' }}>Instant Confirmation</h6>
                      <p style={{ color: colors.lightGray, fontSize: '13px', marginBottom: 0 }}>
                        Get immediate booking confirmation via WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="col-lg-7">
            <div style={{
              backgroundColor: colors.secondaryBg,
              borderRadius: '20px',
              padding: '40px',
              border: `1px solid #333`
            }}>
              {/* Form Header */}
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                  color: colors.primary, 
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '32px',
                  marginBottom: '8px'
                }}>
                  Reserve Your Table
                </h2>
                <p style={{ 
                  color: colors.lightGray, 
                  fontSize: '15px',
                  marginBottom: 0
                }}>
                  Fill in your details and complete payment to confirm
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div style={{ marginBottom: '35px' }}>
                  <h5 style={{ 
                    color: colors.white, 
                    marginBottom: '20px',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '18px',
                    paddingBottom: '10px',
                    borderBottom: `1px solid ${colors.primary}`
                  }}>
                    Personal Information
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.fullName ? '#dc3545' : '#333'
                        }}
                        placeholder="Enter your full name"
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.fullName ? '#dc3545' : '#333'}
                      />
                      {errors.fullName && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.fullName}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.email ? '#dc3545' : '#333'
                        }}
                        placeholder="Enter your email"
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#333'}
                      />
                      {errors.email && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.email}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Phone Number *</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.phone ? '#dc3545' : '#333'
                        }}
                        placeholder="03XXXXXXXXX"
                        maxLength="11"
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.phone ? '#dc3545' : '#333'}
                      />
                      {errors.phone && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.phone}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>WhatsApp Number *</label>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.whatsapp ? '#dc3545' : '#333'
                        }}
                        placeholder="03XXXXXXXXX"
                        maxLength="11"
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.whatsapp ? '#dc3545' : '#333'}
                      />
                      {errors.whatsapp && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.whatsapp}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Details Section */}
                <div style={{ marginBottom: '35px' }}>
                  <h5 style={{ 
                    color: colors.white, 
                    marginBottom: '20px',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '18px',
                    paddingBottom: '10px',
                    borderBottom: `1px solid ${colors.primary}`
                  }}>
                    Reservation Details
                  </h5>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Booking Date *</label>
                      <input
                        type="date"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.bookingDate ? '#dc3545' : '#333'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.bookingDate ? '#dc3545' : '#333'}
                      />
                      {errors.bookingDate && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.bookingDate}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Number of Guests *</label>
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.guests ? '#dc3545' : '#333'
                        }}
                        min="1"
                        max="20"
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.guests ? '#dc3545' : '#333'}
                      />
                      {errors.guests && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.guests}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Start Time *</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.startTime ? '#dc3545' : '#333'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.startTime ? '#dc3545' : '#333'}
                      />
                      {errors.startTime && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.startTime}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>End Time *</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          borderColor: errors.endTime ? '#dc3545' : '#333'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = errors.endTime ? '#dc3545' : '#333'}
                      />
                      {errors.endTime && (
                        <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                          {errors.endTime}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Table Type *</label>
                      <select
                        name="tableType"
                        value={formData.tableType}
                        onChange={handleChange}
                        style={inputStyle}
                      >
                        <option value="standard">Standard Table - PKR 1,000</option>
                        <option value="vip">VIP Lounge - PKR 3,000</option>
                        <option value="family">Family Section - PKR 2,000</option>
                        <option value="couple">Couple's Corner - PKR 2,500</option>
                        <option value="outdoor">Outdoor Terrace - PKR 1,500</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table Availability Section */}
                <div style={{ marginBottom: '35px' }}>
                  <h5 style={{ 
                    color: colors.white, 
                    marginBottom: '20px',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '18px',
                    paddingBottom: '10px',
                    borderBottom: `1px solid ${colors.primary}`
                  }}>
                    Live Table Availability
                  </h5>
                  <div style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid #333`
                  }}>
                    <div className="row">
                      {Object.entries(tableAvailability).map(([type, info]) => (
                        <div key={type} className="col-md-6 mb-3">
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            backgroundColor: '#0a0a0a',
                            borderRadius: '8px',
                            border: formData.tableType === type ? `1px solid ${colors.primary}` : '1px solid transparent',
                            cursor: 'pointer'
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, tableType: type }))}
                          >
                            <span style={{ 
                              color: colors.lightGray, 
                              textTransform: 'capitalize', 
                              fontSize: '13px',
                              fontWeight: formData.tableType === type ? '600' : '400'
                            }}>
                              {type}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: info.available > 0 ? '#28a745' : '#dc3545'
                              }}></span>
                              <span style={{
                                color: info.available > 0 ? '#28a745' : '#dc3545',
                                fontSize: '13px',
                                fontWeight: '500'
                              }}>
                                {info.available} / {info.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Parking Section */}
                <div style={{ marginBottom: '35px' }}>
                  <h5 style={{ 
                    color: colors.white, 
                    marginBottom: '20px',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '18px',
                    paddingBottom: '10px',
                    borderBottom: `1px solid ${colors.primary}`
                  }}>
                    Parking Preference
                  </h5>

                  <div className="mb-4">
                    <label style={{ 
                      color: colors.lightGray, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '15px'
                    }}>
                      <input
                        type="checkbox"
                        name="needParking"
                        checked={formData.needParking}
                        onChange={handleChange}
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          cursor: 'pointer',
                          accentColor: colors.primary
                        }}
                      />
                      I need parking reservation (+PKR 200)
                    </label>
                  </div>

                  {errors.parking && (
                    <div style={{
                      backgroundColor: '#dc354515',
                      border: '1px solid #dc3545',
                      color: '#dc3545',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}>
                      {errors.parking}
                    </div>
                  )}

                  {formData.needParking && (
                    <div style={{
                      backgroundColor: colors.cardBg,
                      padding: '25px',
                      borderRadius: '12px',
                      border: `1px solid #333`,
                      marginTop: '20px'
                    }}>
                      <h6 style={{ 
                        color: colors.primary, 
                        marginBottom: '20px',
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '16px'
                      }}>
                        Vehicle Information
                      </h6>
                      
                      {/* Vehicle Type Selection */}
                      <div className="mb-4">
                        <label style={labelStyle}>Vehicle Type *</label>
                        <div className="d-flex gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'car' }))}
                            style={{
                              flex: 1,
                              padding: '15px',
                              borderRadius: '10px',
                              border: formData.vehicleType === 'car' ? `2px solid ${colors.primary}` : '1px solid #333',
                              backgroundColor: formData.vehicleType === 'car' ? '#F5BD0210' : 'transparent',
                              color: formData.vehicleType === 'car' ? colors.primary : colors.lightGray,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚗</div>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>Car</div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                              {parkingStats.cars.available} slots available
                            </div>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'bike' }))}
                            style={{
                              flex: 1,
                              padding: '15px',
                              borderRadius: '10px',
                              border: formData.vehicleType === 'bike' ? `2px solid ${colors.primary}` : '1px solid #333',
                              backgroundColor: formData.vehicleType === 'bike' ? '#F5BD0210' : 'transparent',
                              color: formData.vehicleType === 'bike' ? colors.primary : colors.lightGray,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏍️</div>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>Bike</div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                              {parkingStats.bikes.available} slots available
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Live Availability Indicator */}
                      <div style={{
                        backgroundColor: (formData.vehicleType === 'car' ? parkingStats.cars.available : parkingStats.bikes.available) > 0 
                          ? '#28a74515' 
                          : '#dc354515',
                        border: `1px solid ${(formData.vehicleType === 'car' ? parkingStats.cars.available : parkingStats.bikes.available) > 0 
                          ? '#28a74530' 
                          : '#dc354530'}`,
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: (formData.vehicleType === 'car' ? parkingStats.cars.available : parkingStats.bikes.available) > 0 
                            ? '#28a745' 
                            : '#dc3545'
                        }}></span>
                        <span style={{
                          color: (formData.vehicleType === 'car' ? parkingStats.cars.available : parkingStats.bikes.available) > 0 
                            ? '#28a745' 
                            : '#dc3545',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          {(formData.vehicleType === 'car' ? parkingStats.cars.available : parkingStats.bikes.available) > 0 
                            ? `${(formData.vehicleType === 'car' ? parkingStats.cars.available : parkingStats.bikes.available)} parking slots available`
                            : 'No parking slots available'}
                        </span>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label style={labelStyle}>Vehicle Number *</label>
                          <input
                            type="text"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            style={{
                              ...inputStyle,
                              borderColor: errors.vehicleNumber ? '#dc3545' : '#333'
                            }}
                            placeholder="ABC-123"
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = errors.vehicleNumber ? '#dc3545' : '#333'}
                          />
                          {errors.vehicleNumber && (
                            <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                              {errors.vehicleNumber}
                            </small>
                          )}
                        </div>

                        <div className="col-md-6 mb-4">
                          <label style={labelStyle}>Vehicle Model *</label>
                          <input
                            type="text"
                            name="vehicleModel"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                            style={{
                              ...inputStyle,
                              borderColor: errors.vehicleModel ? '#dc3545' : '#333'
                            }}
                            placeholder="e.g., Toyota Camry"
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = errors.vehicleModel ? '#dc3545' : '#333'}
                          />
                          {errors.vehicleModel && (
                            <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                              {errors.vehicleModel}
                            </small>
                          )}
                        </div>

                        <div className="col-md-6 mb-4">
                          <label style={labelStyle}>Vehicle Color *</label>
                          <input
                            type="text"
                            name="vehicleColor"
                            value={formData.vehicleColor}
                            onChange={handleChange}
                            style={{
                              ...inputStyle,
                              borderColor: errors.vehicleColor ? '#dc3545' : '#333'
                            }}
                            placeholder="e.g., Black"
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = errors.vehicleColor ? '#dc3545' : '#333'}
                          />
                          {errors.vehicleColor && (
                            <small style={{ color: '#dc3545', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                              {errors.vehicleColor}
                            </small>
                          )}
                        </div>

                        {/* Auto-assigned Parking Slot Display */}
                        <div className="col-md-6 mb-4">
                          <label style={labelStyle}>Parking Slot</label>
                          <div style={{
                            ...inputStyle,
                            backgroundColor: '#0a0a0a',
                            color: '#666',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Auto-assigned on payment
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div style={{
                    backgroundColor: '#dc354515',
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn w-100"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? '#666' : colors.primary,
                    color: colors.mainBg,
                    fontWeight: '600',
                    padding: '16px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '16px',
                    letterSpacing: '1px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Poppins, sans-serif',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 30px rgba(245, 189, 2, 0.3)';
                      e.target.style.backgroundColor = '#d4a800';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.backgroundColor = colors.primary;
                    }
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingBooking && (
        <PaymentModal
          booking={pendingBooking}
          onClose={handlePaymentClose}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default ReservationForm;