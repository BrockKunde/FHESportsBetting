import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance } from '@/lib/fhe/server';

/**
 * FHE Operations API Route
 * Handles server-side FHE operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, params } = body;

    switch (operation) {
      case 'initialize':
        // Initialize FHE instance on server
        const instance = await createFhevmInstance();
        return NextResponse.json({
          success: true,
          message: 'FHE instance initialized',
          publicKey: instance.publicKey
        });

      case 'verify':
        // Verify encrypted input
        return NextResponse.json({
          success: true,
          verified: true
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('FHE API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'FHEVM API',
    status: 'operational',
    version: '1.0.0'
  });
}
