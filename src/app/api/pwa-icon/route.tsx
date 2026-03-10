import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const size = Number(searchParams.get('size')) || 512;
  const fontSize = Math.round(size * 0.38);
  const borderRadius = Math.round(size * 0.18);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
          borderRadius,
          color: '#16C79A',
          fontWeight: 800,
          letterSpacing: Math.round(fontSize * -0.05),
        }}
      >
        GP
      </div>
    ),
    { width: size, height: size },
  );
}
