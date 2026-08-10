// Initialize tables in localStorage
export const initializeTables = () => {
    const existingTables = localStorage.getItem('royneza_tables');
    
    if (!existingTables) {
      const initialTables = {
        standard: { total: 10, available: 10 },
        vip: { total: 5, available: 5 },
        family: { total: 8, available: 8 },
        couple: { total: 6, available: 6 },
        outdoor: { total: 4, available: 4 },
      };
      localStorage.setItem('royneza_tables', JSON.stringify(initialTables));
      return initialTables;
    }
    
    return JSON.parse(existingTables);
  };
  
  // Get available tables
  export const getAvailableTables = () => {
    const tables = initializeTables();
    return tables;
  };
  
  // Check table availability
  export const checkTableAvailability = (tableType) => {
    const tables = initializeTables();
    return tables[tableType]?.available > 0;
  };
  
  // Book a table - reduces available count
  export const bookTable = (tableType) => {
    const tables = initializeTables();
    
    if (tables[tableType] && tables[tableType].available > 0) {
      tables[tableType].available--;
      localStorage.setItem('royneza_tables', JSON.stringify(tables));
      return true;
    }
    
    return false;
  };
  
  // Free up a table - increases available count
  export const freeTable = (tableType) => {
    const tables = initializeTables();
    
    if (tables[tableType] && tables[tableType].available < tables[tableType].total) {
      tables[tableType].available++;
      localStorage.setItem('royneza_tables', JSON.stringify(tables));
      return true;
    }
    
    return false;
  };
  
  // Get table statistics
  export const getTableStats = () => {
    const tables = initializeTables();
    return tables;
  };