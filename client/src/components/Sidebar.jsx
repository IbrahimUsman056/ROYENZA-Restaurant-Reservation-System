import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const colors = {
    primary: '#F5BD02',
    mainBg: '#000000',
    white: '#FFFFFF',
    lightGray: '#CCCCCC'
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
      if (window.innerWidth <= 991) setIsCollapsed(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('royenza_admin_logged_in');
    localStorage.removeItem('royenza_admin_username');
    navigate('/admin');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { path: '/reservation', label: 'New Reservation', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg> },
    { path: '/my-booking', label: 'Bookings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { path: '/', label: 'View Website', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> }
  ];

  const sidebarContent = (
    <>
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '45px', height: '45px', backgroundColor: colors.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(245, 189, 2, 0.3)' }}>
          <span style={{ color: colors.mainBg, fontSize: '22px', fontWeight: 'bold', fontFamily: 'Playfair Display, serif' }}>R</span>
        </div>
        {(!isCollapsed || isMobile) && (
          <div>
            <h3 style={{ color: colors.primary, fontFamily: 'Playfair Display, serif', fontSize: '22px', letterSpacing: '3px', marginBottom: '2px', lineHeight: '1.2' }}>ROYENZA</h3>
            <p style={{ color: colors.lightGray, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 0 }}>Admin</p>
          </div>
        )}
      </div>

      {!isMobile && (
        <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ position: 'absolute', right: '-12px', top: '30px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: colors.primary, border: 'none', color: colors.mainBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(245, 189, 2, 0.4)', zIndex: 101 }}>
          {isCollapsed ? '→' : '←'}
        </button>
      )}

      <nav style={{ flex: 1 }}>
        {menuItems.map((item, index) => {
          const active = location.pathname === item.path;
          return (
            <button key={index} onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }} style={{ width: '100%', padding: (isCollapsed && !isMobile) ? '12px' : '14px 16px', marginBottom: '5px', backgroundColor: active ? colors.primary : 'transparent', color: active ? colors.mainBg : colors.lightGray, border: 'none', borderRadius: '12px', textAlign: 'left', fontSize: '14px', fontWeight: active ? '600' : '400', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: (isCollapsed && !isMobile) ? '0' : '12px', justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start', fontFamily: 'Poppins, sans-serif' }}
              onMouseEnter={(e) => { if (!active && !isMobile) { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.color = colors.primary; } }}
              onMouseLeave={(e) => { if (!active && !isMobile) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.lightGray; } }}
              title={(isCollapsed && !isMobile) ? item.label : ''}>
              {item.icon}
              {(!isCollapsed || isMobile) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
        {(!isCollapsed || isMobile) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', padding: '0 5px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
              <span style={{ color: colors.primary, fontSize: '16px', fontWeight: '600' }}>A</span>
            </div>
            <div>
              <p style={{ color: colors.white, fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>Admin User</p>
              <p style={{ color: colors.lightGray, fontSize: '11px', marginBottom: 0 }}>Administrator</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc354530', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: (isCollapsed && !isMobile) ? '0' : '10px', justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start', fontFamily: 'Poppins, sans-serif' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc3545'; e.currentTarget.style.color = colors.white; e.currentTarget.style.borderColor = '#dc3545'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.borderColor = '#dc354530'; }}
          title={(isCollapsed && !isMobile) ? 'Logout' : ''}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {(!isCollapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <button onClick={() => setMobileOpen(true)} style={{ position: 'fixed', top: '15px', left: '15px', zIndex: 997, backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.primary, fontSize: '20px' }}>☰</button>
        {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 998 }}></div>}
        <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', width: '280px', position: 'fixed', left: 0, top: 0, borderRight: '1px solid #222', padding: '25px 20px', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', zIndex: 999, transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', width: isCollapsed ? '80px' : '280px', position: 'fixed', left: 0, top: 0, borderRight: '1px solid #222', padding: '25px 20px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', zIndex: 100 }}>
      {sidebarContent}
    </div>
  );
};

export default Sidebar;