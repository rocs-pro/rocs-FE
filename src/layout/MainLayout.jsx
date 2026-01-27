import { logout, getUserRole } from '../services/authApi';

const MainLayout = ({ children }) => {
  const role = getUserRole();
  const isAdmin = role === 'admin';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #020617 0%, #020617 100%)',
        color: '#fff',
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          padding: '22px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1e293b',
        }}
      >
        {/* LEFT BRAND */}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '34px',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            SMARTRETAIL <span style={{ color: '#22c55e' }}>PRO</span>
          </h1>
          <p
            style={{
              marginTop: '6px',
              color: '#94a3b8',
              fontSize: '14px',
            }}
          >
            Retail Operations Control System (ROCS)
          </p>
        </div>

        {/* RIGHT USER LOGOUT CARD */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            padding: '12px 18px',
            borderRadius: '14px',
            background: 'linear-gradient(180deg, #0f172a, #020617)',
            boxShadow: 'inset 0 0 0 1px #1e293b',
          }}
        >
          {/* AVATAR */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
            }}
          >
            {isAdmin ? 'A' : 'M'}
          </div>

          {/* USER INFO */}
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700 }}>
              {isAdmin ? 'Admin' : 'Manager'}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              {isAdmin ? '' : ''}
            </div>
          </div>

          {/* DIVIDER */}
          <div
            style={{
              width: '1px',
              height: '36px',
              background: '#1e293b',
            }}
          />

          {/* LOGOUT */}
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5f5',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ padding: '40px 60px' }}>{children}</div>
    </div>
  );
};

export default MainLayout;
