import React, { useState, useRef } from 'react';
import { getPaymentMethods, calculateAmount } from '../utils/PaymentManager';

const PaymentModal = ({ booking, onClose, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); 
  const fileInputRef = useRef(null);

  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    secondaryBg: '#111111',
    cardBg: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  const paymentMethods = getPaymentMethods();
  const amountDetails = calculateAmount(booking.guests, booking.tableType, booking.needParking);

// Cleaned upload reader WITH canvas scaling and compression logic
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        
        img.onload = () => {
          // Initialize canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Define your maximum bounding dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio scaling
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Set canvas dimensions to the newly calculated size
          canvas.width = width;
          canvas.height = height;

          // Draw the original image onto the smaller canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Export as compressed JPEG (0.7 quality balance)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          // Update state targets with lightweight payload
          setScreenshotPreview(compressedBase64);
          setScreenshot(file); // Keeps reference valid for verification checks
        };
      };
      
      reader.readAsDataURL(file);
      setError('');
    }
  };

  // Handle payment confirmation
  const handlePaymentConfirm = () => {
    if (!screenshot) {
      setError('Please upload payment screenshot');
      return;
    }
    if (!transactionId.trim()) {
      setError('Please enter transaction ID');
      return;
    }

    const paymentData = {
      method: selectedMethod.id,
      methodName: selectedMethod.name,
      accountNumber: selectedMethod.accountNumber,
      transactionId: transactionId.trim(),     
      screenshot: screenshotPreview,          // Feeds raw image string directly into the schema target
      amount: amountDetails.totalAmount,
      paidAt: new Date().toISOString()
    };

    onPaymentComplete(paymentData);
  };

  return (
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
      zIndex: 10000,
      padding: '20px',
      backdropFilter: 'blur(10px)',
      overflowY: 'auto'
    }}>
      <div style={{
        position: 'relative', 
        backgroundColor: '#0a0a0a',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid #222',
        maxWidth: '550px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h3 style={{ 
            color: colors.white, 
            fontFamily: 'Playfair Display, serif',
            fontSize: '24px',
            marginBottom: '8px'
          }}>
            Complete Payment
          </h3>
          <p style={{ color: colors.lightGray, fontSize: '14px', marginBottom: 0 }}>
            Pay to confirm your reservation
          </p>
        </div>

        {/* Amount Display */}
        <div style={{
          backgroundColor: '#F5BD0210',
          border: '1px solid #F5BD0230',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Total Amount
          </p>
          <h2 style={{ color: colors.primary, fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>
            PKR {amountDetails.totalAmount.toLocaleString()}
          </h2>
          
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>Table: PKR {amountDetails.tableCharge}</div>
            <div>Guests ({booking.guests} × PKR {amountDetails.perPersonCharge}): PKR {amountDetails.guestCharge}</div>
            {booking.needParking && <div>Parking: PKR {amountDetails.parkingCharge}</div>}
          </div>
        </div>

        {/* Step 1: Select Payment Method */}
        {step === 1 && (
          <div>
            <p style={{ color: colors.white, fontSize: '14px', marginBottom: '15px', fontWeight: '500' }}>
              Select Payment Method
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method);
                    setStep(2);
                  }}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${selectedMethod?.id === method.id ? method.color : '#333'}`,
                    backgroundColor: selectedMethod?.id === method.id ? `${method.color}10` : '#111',
                    color: colors.white,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = method.color;
                    e.currentTarget.style.backgroundColor = `${method.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMethod?.id !== method.id) {
                      e.currentTarget.style.borderColor = '#333';
                      e.currentTarget.style.backgroundColor = '#111';
                    } else {
                      e.currentTarget.style.borderColor = method.color;
                      e.currentTarget.style.backgroundColor = `${method.color}10`;
                    }
                  }}
                >
                  {/* Payment Logo */}
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    padding: '8px'
                  }}>
                    <img 
                      src={method.logo} 
                      alt={method.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundColor = method.color;
                        e.target.parentElement.innerHTML = `<span style="color:white;font-weight:bold;font-size:20px;font-family:sans-serif;">${method.name.charAt(0)}</span>`;
                      }}
                    />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      {method.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {method.bankName ? `${method.bankName} - ` : ''}{method.accountNumber}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Payment Details */}
        {step === 2 && selectedMethod && (
          <div>
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.lightGray,
                cursor: 'pointer',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              Im back to methods
            </button>

            <div style={{
              backgroundColor: '#111',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${selectedMethod.color}30`,
              marginBottom: '20px'
            }}>
              <p style={{ color: colors.white, fontSize: '14px', fontWeight: '500', marginBottom: '15px' }}>
                Send payment to:
              </p>
              
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#888', fontSize: '12px' }}>Account Name</span>
                <p style={{ color: colors.white, fontSize: '15px', fontWeight: '600', marginTop: '4px' }}>
                  {selectedMethod.accountName}
                </p>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#888', fontSize: '12px' }}>
                  {selectedMethod.id === 'bank' ? 'IBAN' : 'Account Number'}
                </span>
                <p style={{ 
                  color: colors.primary, 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  fontFamily: 'monospace',
                  marginTop: '4px',
                  letterSpacing: '1px'
                }}>
                  {selectedMethod.accountNumber}
                </p>
              </div>

              {selectedMethod.bankName && (
                <div>
                  <span style={{ color: '#888', fontSize: '12px' }}>Bank</span>
                  <p style={{ color: colors.white, fontSize: '15px', marginTop: '4px' }}>
                    {selectedMethod.bankName}
                  </p>
                </div>
              )}
            </div>

            <div style={{
              backgroundColor: '#F5BD0210',
              border: '1px solid #F5BD0230',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ color: colors.primary, fontSize: '14px', fontWeight: '600', marginBottom: 0 }}>
                Amount to Pay: PKR {amountDetails.totalAmount.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setStep(3)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: colors.primary,
                color: colors.mainBg,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              I've Made the Payment
            </button>
          </div>
        )}

        {/* Step 3: Upload Screenshot */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.lightGray,
                cursor: 'pointer',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ← Back
            </button>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: colors.white, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '10px' }}>
                Transaction ID / Reference Number *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => {
                  setTransactionId(e.target.value);
                  setError('');
                }}
                placeholder="Enter transaction ID"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #333',
                  backgroundColor: '#111',
                  color: colors.white,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: colors.white, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '10px' }}>
                Upload Payment Screenshot *
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />

              {!screenshotPreview ? (
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    width: '100%',
                    padding: '40px',
                    borderRadius: '12px',
                    border: '2px dashed #333',
                    backgroundColor: 'transparent',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📸</div>
                  Click to upload screenshot
                </button>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    src={screenshotPreview}
                    alt="Payment Screenshot"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid #333'
                    }}
                  />
                  <button
                    onClick={() => {
                      setScreenshot(null);
                      setScreenshotPreview(null);
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div style={{
                backgroundColor: '#dc354515',
                border: '1px solid #dc3545',
                color: '#dc3545',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handlePaymentConfirm}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: colors.primary,
                color: colors.mainBg,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              Confirm Payment
            </button>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;