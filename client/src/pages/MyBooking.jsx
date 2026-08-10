import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function MyBooking() {
  // Colors from the theme
  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  // State for search
  const [searchType, setSearchType] = useState('phone');
  const [searchValue, setSearchValue] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state for API requests

  // State for cancel confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Function to get status badge settings (normalized case evaluation)
  function getStatusBadge(status) {
    const currentStatus = status ? status.toLowerCase() : 'pending';
    if (currentStatus === 'confirmed') {
      return {
        backgroundColor: '#28a74520',
        color: '#28a745',
        border: '1px solid #28a745',
        text: 'CONFIRMED',
        dot: '#28a745'
      };
    } else if (currentStatus === 'cancelled') {
      return {
        backgroundColor: '#dc354520',
        color: '#dc3545',
        border: '1px solid #dc3545',
        text: 'CANCELLED',
        dot: '#dc3545'
      };
    } else {
      return {
        backgroundColor: '#F5BD0220',
        color: '#F5BD02',
        border: '1px solid #F5BD02',
        text: 'PENDING',
        dot: '#F5BD02'
      };
    }
  }

// Handle live search from Backend Database
  async function handleSearch(e) {
    e.preventDefault();
    setError('');
    setSearched(false);
    setBookings([]);

    const queryVal = searchValue.trim();

    if (!queryVal) {
      setError('Please enter a search value');
      return;
    }

    setLoading(true);

    try {
      // Determine target path dynamically based on radio selection
      let url = 'https://royneza-backend.onrender.com/api/bookings/search/';
      if (searchType === 'phone') {
        url += `phone/${encodeURIComponent(queryVal)}`;
      } else {
        url += `id/${encodeURIComponent(queryVal)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to retrieve data from the server.');
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
        setSearched(true);

        if (data.bookings.length === 0) {
          setError('No bookings found matching your search criteria.');
        }
      } else {
        setError(data.message || 'Error executing search.');
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError('Connection to backend server failed.');
    } finally {
      setLoading(false);
    }
  }

  // Handle cancel booking execution against database instance
  async function handleCancelBooking(bookingId) {
    setError('');
    try {
      // Sends a PUT request directly to your newly configured route
      const response = await fetch(`https://royneza-backend.onrender.com/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Cancelled' })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Sync local component state to reflect changes instantly on screen
        const updatedSearchResults = bookings.map(function (booking) {
          if (booking.bookingId === bookingId) {
            return { ...booking, status: 'Cancelled' };
          }
          return booking;
        });

        setBookings(updatedSearchResults);
        setShowModal(false);
        setSelectedBooking(null);
      } else {
        setError(data.message || 'Failed to cancel the reservation via the server.');
        setShowModal(false);
      }
    } catch (err) {
      console.error("Cancellation request error:", err);
      setError('Could not connect to server to process cancellation.');
      setShowModal(false);
    }
  }

  // Open cancel confirmation modal
  function openCancelModal(booking) {
    setSelectedBooking(booking);
    setShowModal(true);
  }

  // Base input layout styles
  const inputStyle = {
    backgroundColor: colors.cardBg,
    border: '1px solid #333',
    color: colors.white,
    padding: '14px 16px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <div style={{ backgroundColor: colors.mainBg, minHeight: '100vh', padding: '120px 0 50px 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ width: '4px', height: '40px', backgroundColor: colors.primary, borderRadius: '2px' }}></div>
            <div>
              <h1 style={{ color: colors.white, fontSize: '36px', fontFamily: 'Playfair Display, serif', marginBottom: '5px' }}>
                My Bookings
              </h1>
              <p style={{ color: colors.lightGray, fontSize: '15px', marginBottom: 0 }}>
                Search and manage your reservations
              </p>
            </div>
          </div>
        </div>

        {/* Global Error Banner (Catching Database Errors) */}
        {error && (
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div style={{
                backgroundColor: '#dc354510', border: '1px solid #dc3545', color: '#dc3545',
                padding: '12px 16px', borderRadius: '8px', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#dc3545',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white,
                  fontSize: '12px', fontWeight: 'bold', flexShrink: 0
                }}>!</span>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div style={{ backgroundColor: colors.secondaryBg, borderRadius: '15px', padding: '35px', border: '1px solid #333' }}>
              <h4 style={{ color: colors.white, marginBottom: '25px', fontFamily: 'Playfair Display, serif', fontSize: '20px' }}>
                Search Your Booking
              </h4>

              <form onSubmit={handleSearch}>
                {/* Search Type Selection */}
                <div className="mb-4">
                  <div className="d-flex gap-4">
                    
                    {/* Radio: Search by Phone */}
                    <label style={{ 
                      color: searchType === 'phone' ? colors.primary : colors.lightGray, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
                      fontSize: '14px', fontWeight: searchType === 'phone' ? '600' : '400', transition: 'all 0.3s ease' 
                    }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: `2px solid ${searchType === 'phone' ? colors.primary : '#666'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: searchType === 'phone' ? colors.primary : 'transparent'
                      }}>
                        {searchType === 'phone' && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.mainBg }}></div>
                        )}
                      </div>
                      <span>Search by Phone</span>
                      <input
                        type="radio"
                        name="searchType"
                        value="phone"
                        checked={searchType === 'phone'}
                        onChange={function (e) {
                          setSearchType(e.target.value);
                          setSearchValue('');
                          setBookings([]);
                          setSearched(false);
                          setError('');
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                    
                    {/* Radio: Search by Booking ID */}
                    <label style={{ 
                      color: searchType === 'bookingId' ? colors.primary : colors.lightGray, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
                      fontSize: '14px', fontWeight: searchType === 'bookingId' ? '600' : '400', transition: 'all 0.3s ease' 
                    }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: `2px solid ${searchType === 'bookingId' ? colors.primary : '#666'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: searchType === 'bookingId' ? colors.primary : 'transparent'
                      }}>
                        {searchType === 'bookingId' && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.mainBg }}></div>
                        )}
                      </div>
                      <span>Search by Booking ID</span>
                      <input
                        type="radio"
                        name="searchType"
                        value="bookingId"
                        checked={searchType === 'bookingId'}
                        onChange={function (e) {
                          setSearchType(e.target.value);
                          setSearchValue('');
                          setBookings([]);
                          setSearched(false);
                          setError('');
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>

                  </div>
                </div>

                {/* Search Input and Button Group */}
                <div className="d-flex gap-3">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={function (e) { setSearchValue(e.target.value); }}
                    style={inputStyle}
                    placeholder={searchType === 'phone' ? 'Enter your phone number' : 'Enter your booking ID'}
                    onFocus={function (e) { e.target.style.borderColor = colors.primary; }}
                    onBlur={function (e) { e.target.style.borderColor = '#333'; }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: colors.primary, color: colors.mainBg, fontWeight: '600',
                      padding: '14px 30px', border: 'none', borderRadius: '8px', fontSize: '14px',
                      letterSpacing: '1px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif', opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'SEARCHING...' : 'SEARCH'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Search Results Display */}
        {searched && bookings.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h4 style={{ color: colors.white, fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: 0 }}>
                Search Results 
                <span style={{ color: colors.primary, marginLeft: '10px' }}>
                  ({bookings.length} {bookings.length > 1 ? 'bookings' : 'booking'} found)
                </span>
              </h4>
            </div>

            {bookings.map(function (booking, index) {
              const statusBadge = getStatusBadge(booking.status);
              
              return (
                <div key={index} style={{
                  backgroundColor: colors.secondaryBg, borderRadius: '15px', padding: '35px',
                  border: '1px solid #333', marginBottom: '25px'
                }}>
                  
                  {/* Result Item Card Header */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #333',
                    flexWrap: 'wrap', gap: '15px'
                  }}>
                    <div>
                      <p style={{ color: colors.lightGray, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                        Booking ID
                      </p>
                      <h4 style={{ color: colors.primary, fontFamily: 'monospace', fontSize: '20px', marginBottom: 0, letterSpacing: '1px' }}>
                        {booking.bookingId}
                      </h4>
                    </div>
                    <span style={{
                      backgroundColor: statusBadge.backgroundColor, color: statusBadge.color, border: statusBadge.border,
                      padding: '8px 20px', borderRadius: '50px', fontWeight: '600', fontSize: '12px',
                      letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusBadge.dot }}></span>
                      {statusBadge.text}
                    </span>
                  </div>

                  {/* Customer vs Reservation Details Rows */}
                  <div className="row mb-4">
                    
                    {/* Column: Customer Info */}
                    <div className="col-md-6 mb-4 mb-md-0">
                      <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '25px', border: '1px solid #333', height: '100%' }}>
                        <h6 style={{ 
                          color: colors.white, marginBottom: '20px', fontFamily: 'Playfair Display, serif', 
                          fontSize: '16px', paddingBottom: '10px', borderBottom: `1px solid ${colors.primary}` 
                        }}>
                          Customer Details
                        </h6>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>FULL NAME</span>
                          <span style={{ color: colors.white, fontSize: '15px', fontWeight: '500' }}>{booking.customerName}</span>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>EMAIL</span>
                          <span style={{ color: colors.white, fontSize: '15px' }}>{booking.email}</span>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>PHONE</span>
                          <span style={{ color: colors.white, fontSize: '15px' }}>{booking.phone}</span>
                        </div>
                        <div>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>WHATSAPP</span>
                          <span style={{ color: colors.white, fontSize: '15px' }}>{booking.whatsapp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column: Reservation Info */}
                    <div className="col-md-6">
                      <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '25px', border: '1px solid #333', height: '100%' }}>
                        <h6 style={{ 
                          color: colors.white, marginBottom: '20px', fontFamily: 'Playfair Display, serif', 
                          fontSize: '16px', paddingBottom: '10px', borderBottom: `1px solid ${colors.primary}` 
                        }}>
                          Reservation Details
                        </h6>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>DATE</span>
                          <span style={{ color: colors.white, fontSize: '15px', fontWeight: '500' }}>{booking.bookingDate}</span>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>TIME</span>
                          <span style={{ color: colors.white, fontSize: '15px' }}>{booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>GUESTS</span>
                          <span style={{ color: colors.white, fontSize: '15px' }}>{booking.guests} {booking.guests > 1 ? 'persons' : 'person'}</span>
                        </div>
                        <div>
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>TABLE TYPE</span>
                          <span style={{ color: colors.white, fontSize: '15px', textTransform: 'capitalize' }}>{booking.tableType}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Optional Row: Parking Details */}
                  {booking.needParking && booking.parking && (
                    <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '25px', border: '1px solid #333', marginBottom: '20px' }}>
                      <h6 style={{ 
                        color: colors.white, marginBottom: '20px', fontFamily: 'Playfair Display, serif', 
                        fontSize: '16px', paddingBottom: '10px', borderBottom: `1px solid ${colors.primary}` 
                      }}>
                        Parking Details
                      </h6>
                      <div className="row">
                        <div className="col-md-3 mb-3 mb-md-0">
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>VEHICLE NO.</span>
                          <span style={{ color: colors.white, fontSize: '15px', fontWeight: '500' }}>{booking.parking.vehicleNumber}</span>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>MODEL</span>
                          <span style={{ color: colors.white, fontSize: '15px' }}>{booking.parking.vehicleModel}</span>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>COLOR</span>
                          <span style={{ color: colors.white, fontSize: '15px' }}>{booking.parking.vehicleColor}</span>
                        </div>
                        <div className="col-md-3">
                          <span style={{ color: colors.lightGray, fontSize: '12px', display: 'block', marginBottom: '4px' }}>SLOT</span>
                          <span style={{ color: colors.primary, fontSize: '18px', fontWeight: '600', fontFamily: 'monospace' }}>
                            {booking.parking.parkingSlot}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancel Booking Action Button (Visible only if status matches 'pending') */}
                  {booking.status && booking.status.toLowerCase() === 'pending' && (
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={function () { openCancelModal(booking); }}
                        style={{
                          backgroundColor: 'transparent', color: '#dc3545', fontWeight: '500',
                          padding: '10px 24px', borderRadius: '8px', border: '1px solid #dc3545',
                          fontSize: '14px', letterSpacing: '0.5px', cursor: 'pointer',
                          transition: 'all 0.3s ease', fontFamily: 'Poppins, sans-serif'
                        }}
                        onMouseEnter={function (e) {
                          e.target.style.backgroundColor = '#dc3545';
                          e.target.style.color = colors.white;
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={function (e) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#dc3545';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* Global Footer Navigation Link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link 
            to="/reservation" 
            style={{
              backgroundColor: colors.primary, color: colors.mainBg, fontWeight: '600',
              padding: '15px 35px', borderRadius: '8px', border: 'none', textDecoration: 'none',
              fontSize: '15px', letterSpacing: '1px', display: 'inline-block',
              transition: 'all 0.3s ease', fontFamily: 'Poppins, sans-serif'
            }}
            onMouseEnter={function (e) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 30px rgba(245, 189, 2, 0.3)';
              e.target.style.backgroundColor = '#d4a800';
            }}
            onMouseLeave={function (e) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = colors.primary;
            }}
          >
            MAKE NEW RESERVATION
          </Link>
        </div>
      </div>

      {/* Cancel Confirmation Dialog Overlay Box */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: colors.secondaryBg, borderRadius: '20px', padding: '40px',
            border: '1px solid #333', maxWidth: '500px', width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#dc354510',
                border: '2px solid #dc3545', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <span style={{ color: '#dc3545', fontSize: '30px', fontWeight: 'bold' }}>!</span>
              </div>
              <h3 style={{ color: colors.white, fontFamily: 'Playfair Display, serif', marginBottom: '12px', fontSize: '24px' }}>
                Cancel Reservation?
              </h3>
              <p style={{ color: colors.lightGray, fontSize: '14px', marginBottom: '10px' }}>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              {selectedBooking && (
                <p style={{ color: colors.primary, fontFamily: 'monospace', fontSize: '14px', marginBottom: 0 }}>
                  Booking ID: {selectedBooking.bookingId}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={function () {
                  setShowModal(false);
                  setSelectedBooking(null);
                }}
                style={{
                  backgroundColor: 'transparent', color: colors.white, fontWeight: '500',
                  padding: '12px 30px', borderRadius: '8px', border: '1px solid #666',
                  fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s ease',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseEnter={function (e) {
                  e.target.style.borderColor = colors.white;
                  e.target.style.backgroundColor = '#ffffff10';
                }}
                onMouseLeave={function (e) {
                  e.target.style.borderColor = '#666';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Keep Booking
              </button>
              
              <button
                onClick={function () { handleCancelBooking(selectedBooking.bookingId); }}
                style={{
                  backgroundColor: '#dc3545', color: colors.white, fontWeight: '500',
                  padding: '12px 30px', borderRadius: '8px', border: 'none',
                  fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s ease',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseEnter={function (e) {
                  e.target.style.backgroundColor = '#c82333';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={function (e) {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooking;