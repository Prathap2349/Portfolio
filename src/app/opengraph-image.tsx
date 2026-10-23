import { ImageResponse } from 'next/og'

export const alt = 'Prathap | AI & Data Science Student'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#111827',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '9999px',
              backgroundColor: '#F59E0B',
            }}
          />
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: '#F59E0B',
              textTransform: 'uppercase',
            }}
          >
            PRATHAP · PORTFOLIO
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#F3F4F6',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            AI & Data Science Student
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#9CA3AF',
              lineHeight: 1.4,
              maxWidth: '900px',
              margin: 0,
            }}
          >
            Building offline-first desktop tools, native mobile apps, and practical AI applications.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '18px',
            color: '#6B7280',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>Tamil Nadu, India</span>
          <span>•</span>
          <span>B.Tech AI & Data Science</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
