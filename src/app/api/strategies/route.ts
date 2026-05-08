// Strategies API - CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  getStrategiesByUser, 
  createStrategy, 
  updateStrategy, 
  deleteStrategy,
  strategyValidation,
  StrategyFormData 
} from '@/lib/strategy-lab/builder';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const strategies = await getStrategiesByUser(user.id);
  
  return NextResponse.json({ strategies });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = strategyValidation.parse(body);
    
    const strategy = await createStrategy(user.id, validated);
    
    return NextResponse.json({ strategy }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating strategy:', error);
    return NextResponse.json(
      { error: 'Failed to create strategy' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const strategyId = searchParams.get('id');

  if (!strategyId) {
    return NextResponse.json(
      { error: 'Strategy ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    
    const strategy = await updateStrategy(strategyId, user.id, body);
    
    return NextResponse.json({ strategy });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating strategy:', error);
    return NextResponse.json(
      { error: 'Failed to update strategy' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const strategyId = searchParams.get('id');

  if (!strategyId) {
    return NextResponse.json(
      { error: 'Strategy ID is required' },
      { status: 400 }
    );
  }

  try {
    await deleteStrategy(strategyId, user.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting strategy:', error);
    return NextResponse.json(
      { error: 'Failed to delete strategy' },
      { status: 500 }
    );
  }
}