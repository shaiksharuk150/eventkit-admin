// import  supabase  from '@/lib/supabaseClient';
// import { NextRequest, NextResponse } from 'next/server';

// // Create Payment
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { data, error } = await supabase.from('Payments').insert([body]).select();
//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }
//     return NextResponse.json(data, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
//   }
// }

// // Get Payments
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (id) {
//       // Get a single payment by id
//       const { data, error } = await supabase.from('Payments').select('*').eq('payment_id', id).single();
//       if (error) {
//         return NextResponse.json({ error: error.message }, { status: 400 });
//       }
//       if (!data) {
//         return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
//       }
//       return NextResponse.json(data, { status: 200 });
//     } else {
//       // Get all payments
//       const { data, error } = await supabase.from('Payments').select('*');
//       if (error) {
//         return NextResponse.json({ error: error.message }, { status: 400 });
//       }
//       return NextResponse.json(data, { status: 200 });
//     }
//   } catch (error) {
//     return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
//   }
// }

// // Update Payment
// export async function PUT(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get('id');
//         if (!id) {
//             return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
//         }
//         const body = await req.json();
//         const { data, error } = await supabase.from('Payments').update(body).eq('payment_id', id).select();
//         if (error) {
//             return NextResponse.json({ error: error.message }, { status: 400 });
//         }
//         return NextResponse.json(data, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
//     }
// }

// // Delete Payment
// export async function DELETE(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get('id');
//         if (!id) {
//             return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
//         }
//         const { error } = await supabase.from('Payments').delete().eq('payment_id', id);
//         if (error) {
//             return NextResponse.json({ error: error.message }, { status: 400 });
//         }
//         return NextResponse.json({ message: 'Payment deleted successfully' }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
//     }
// } 