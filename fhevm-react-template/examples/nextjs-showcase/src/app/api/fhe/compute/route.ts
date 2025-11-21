import { NextRequest, NextResponse } from 'next/server';

/**
 * Homomorphic Computation API Route
 * Demonstrates FHE computation capabilities
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, encryptedInputs } = body;

    if (!operation || !encryptedInputs) {
      return NextResponse.json(
        { success: false, error: 'Missing operation or encrypted inputs' },
        { status: 400 }
      );
    }

    // Supported operations: add, sub, mul, div, gt, lt, eq
    const validOperations = ['add', 'sub', 'mul', 'div', 'gt', 'lt', 'eq'];

    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        { success: false, error: `Invalid operation. Supported: ${validOperations.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      operation,
      message: 'Homomorphic computation performed',
      note: 'Actual computation happens on blockchain smart contracts'
    });
  } catch (error) {
    console.error('Computation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
