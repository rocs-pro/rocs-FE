import { useNavigate } from 'react-router-dom';

const DashboardCard = ({
  title,
  subtitle,
  color,
  badge,
  path,
  disabled,
  icon: Icon,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => !disabled && navigate(path)}
      style={{
        width: '400px',              // bigger card
        borderRadius: '18px',
        background: '#1e293b',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* TOP COLOR BAR */}
      <div
        style={{
          background: color,
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={36} color="#fff" />
      </div>

      {/* CONTENT */}
      <div style={{ padding: '18px', textAlign: 'center' }}>
        <h3 style={{ margin: '6px 0 4px' }}>{title}</h3>

        <p
          style={{
            margin: 0,
            color: '#94a3b8',
            fontSize: '13px',
          }}
        >
          {subtitle}
        </p>

        {badge && (
          <div style={{ marginTop: '10px' }}>
            <span
              style={{
                background: '#22c55e',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
