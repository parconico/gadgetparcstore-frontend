import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
          borderRadius: 36,
          color: '#16C79A',
          fontWeight: 800,
          letterSpacing: -3,
        }}
      >
        GP
      </div>
    ),
    { ...size },
  );
}
