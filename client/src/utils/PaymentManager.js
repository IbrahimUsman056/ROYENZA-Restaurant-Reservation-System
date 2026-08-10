// Payment method logos from public folder
const paymentLogos = {
    jazzcash: '/JS.png',    // Place your JazzCash logo in public folder
    sadapay: '/S.png',      // Place your SadaPay logo in public folder
    bank: '/M.png'             // Place your Bank logo in public folder
  };
  
  // Initialize payment methods
  export const getPaymentMethods = () => {
    return [
      {
        id: 'jazzcash',
        name: 'JazzCash',
        logo: paymentLogos.jazzcash,
        accountNumber: '0340-7146871',
        accountName: 'Abdul Ghani',
        color: '#EA2027',
        gradient: 'linear-gradient(135deg, #EA2027, #C8102E)'
      },
      {
        id: 'sadapay',
        name: 'SadaPay',
        logo: paymentLogos.sadapay,
        accountNumber: '0340-7146871',
        accountName: 'Abdul Ghani',
        color: '#8B5CF6',
        gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
      },
      {
        id: 'bank',
        name: 'Bank Transfer',
        logo: paymentLogos.bank,
        accountNumber: 'PK36MEZN0001234567890123',
        accountName: 'Royneza Restaurant',
        bankName: 'Meezan Bank',
        color: '#059669',
        gradient: 'linear-gradient(135deg, #059669, #047857)'
      }
    ];
  };
  
  // Calculate booking amount
  export const calculateAmount = (guests, tableType, hasParking) => {
    const tablePrices = {
      standard: 1000,
      vip: 3000,
      family: 2000,
      couple: 2500,
      outdoor: 1500
    };
    
    const baseAmount = tablePrices[tableType] || 1000;
    const perPersonCharge = 500;
    const parkingCharge = hasParking ? 200 : 0;
    
    const totalAmount = baseAmount + (guests * perPersonCharge) + parkingCharge;
    
    return {
      tableCharge: baseAmount,
      perPersonCharge: perPersonCharge,
      guestCharge: guests * perPersonCharge,
      parkingCharge: parkingCharge,
      totalAmount: totalAmount
    };
  };