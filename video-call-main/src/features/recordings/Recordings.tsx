export default function Recordings() {
  const dummyRecordings = [
    { id: 1, title: 'Team Meeting - Q1 Planning', date: '2024-01-15', duration: '45:22' },
    { id: 2, title: 'Product Demo - New Features', date: '2024-01-12', duration: '32:18' },
    { id: 3, title: 'Client Presentation - ACME Corp', date: '2024-01-10', duration: '58:41' },
    { id: 4, title: 'Training Session - Onboarding', date: '2024-01-08', duration: '1:22:15' },
    { id: 5, title: 'Interview - Frontend Position', date: '2024-01-05', duration: '38:09' },
  ];

  return (
    <div style={{ 
      padding: 24, 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      color: '#212529'
    }}>
      <h2 style={{ marginBottom: 24 }}>🎥 Recordings</h2>
      
      <div style={{ 
        display: 'grid', 
        gap: 16,
        maxWidth: 800 
      }}>
        {dummyRecordings.map(recording => (
          <div 
            key={recording.id}
            style={{
              backgroundColor: 'white',
              padding: '20px 24px',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: 18,
                color: '#212529'
              }}>
                {recording.title}
              </h3>
              <div style={{ 
                display: 'flex', 
                gap: 16,
                fontSize: 14,
                color: '#6c757d'
              }}>
                <span>📅 {recording.date}</span>
                <span>⏱️ {recording.duration}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#e7f5ff',
                color: '#0d6efd',
                border: '1px solid #cde5ff',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500
              }}>
                ▶️ Play
              </button>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d',
                border: '1px solid #dee2e6',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500
              }}>
                ⬇️ Download
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: 32,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        border: '1px solid #e9ecef',
        maxWidth: 800
      }}>
        <p style={{ 
          margin: 0, 
          color: '#6c757d',
          textAlign: 'center'
        }}>
          Total recordings: {dummyRecordings.length}
        </p>
      </div>
    </div>
  );
}