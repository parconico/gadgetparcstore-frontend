import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
          borderRadius: 6,
          color: '#16C79A',
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        GP
      </div>
    ),
    { ...size },
  );
}
