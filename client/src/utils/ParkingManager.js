// Initialize parking slots in localStorage
export const initializeParkingSlots = () => {
    const existingSlots = localStorage.getItem('royneza_parking_slots');
    
    if (!existingSlots) {
      const initialSlots = {
        cars: [
          { id: 'C1', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C2', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C3', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C4', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C5', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C6', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C7', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C8', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C9', type: 'car', status: 'available', vehicleNumber: null },
          { id: 'C10', type: 'car', status: 'available', vehicleNumber: null },
        ],
        bikes: [
          { id: 'B1', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B2', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B3', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B4', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B5', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B6', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B7', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B8', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B9', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B10', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B11', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B12', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B13', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B14', type: 'bike', status: 'available', vehicleNumber: null },
          { id: 'B15', type: 'bike', status: 'available', vehicleNumber: null },
        ]
      };
      localStorage.setItem('royneza_parking_slots', JSON.stringify(initialSlots));
      return initialSlots;
    }
    
    return JSON.parse(existingSlots);
  };
  
  // Get available parking slots
  export const getAvailableParkingSlots = (vehicleType) => {
    const slots = initializeParkingSlots();
    const typeSlots = vehicleType === 'car' ? slots.cars : slots.bikes;
    return typeSlots.filter(slot => slot.status === 'available');
  };
  
  // Assign parking slot automatically
  export const assignParkingSlot = (vehicleType, vehicleNumber) => {
    const slots = initializeParkingSlots();
    const typeSlots = vehicleType === 'car' ? slots.cars : slots.bikes;
    
    // Find first available slot
    const availableSlot = typeSlots.find(slot => slot.status === 'available');
    
    if (!availableSlot) {
      return null; // No slots available
    }
    
    // Mark slot as occupied
    availableSlot.status = 'occupied';
    availableSlot.vehicleNumber = vehicleNumber;
    
    // Save updated slots
    localStorage.setItem('royneza_parking_slots', JSON.stringify(slots));
    
    return availableSlot.id;
  };
  
  // Free up parking slot
  export const freeParkingSlot = (vehicleType, slotId) => {
    const slots = initializeParkingSlots();
    const typeSlots = vehicleType === 'car' ? slots.cars : slots.bikes;
    
    const slot = typeSlots.find(s => s.id === slotId);
    if (slot) {
      slot.status = 'available';
      slot.vehicleNumber = null;
      localStorage.setItem('royneza_parking_slots', JSON.stringify(slots));
      return true;
    }
    return false;
  };
  
  // Get parking statistics
  export const getParkingStats = () => {
    const slots = initializeParkingSlots();
    
    return {
      cars: {
        total: slots.cars.length,
        available: slots.cars.filter(s => s.status === 'available').length,
        occupied: slots.cars.filter(s => s.status === 'occupied').length,
      },
      bikes: {
        total: slots.bikes.length,
        available: slots.bikes.filter(s => s.status === 'available').length,
        occupied: slots.bikes.filter(s => s.status === 'occupied').length,
      }
    };
  };