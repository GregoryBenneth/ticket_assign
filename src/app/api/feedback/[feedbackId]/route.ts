// import { NextRequest, NextResponse } from 'next/server';
// import type { DesignFeedback } from '@/lib/types';

// let designFeedback: DesignFeedback[] = [];

// export async function GET(
//     request: NextRequest,
//     { params }: { params: { feedbackId: string } }
// ) {
//     const feedbackId = params.feedbackId;

//     const feedback = designFeedback.find(item => item.id === feedbackId);

//     if (!feedback) {
//         return NextResponse.json(
//             { error: 'Feedback not found' },
//             { status: 404 }
//         );
//     }

//     return NextResponse.json(feedback);
// }

// export async function PATCH(
//     request: NextRequest,
//     { params }: { params: { feedbackId: string } }
// ) {
//     const feedbackId = params.feedbackId;
//     const updateData = await request.json();

//     const protectedFields = ['id', 'designFileId', 'createdAt'];

//     protectedFields.forEach(field => {
//         if (field in updateData) {
//             delete updateData[field];
//         }
//     });

//     const feedbackIndex = designFeedback.findIndex(item => item.id === feedbackId);

//     if (feedbackIndex === -1) {
//         return NextResponse.json(
//             { error: 'Feedback not found' },
//             { status: 404 }
//         );
//     }

//     designFeedback[feedbackIndex] = {
//         ...designFeedback[feedbackIndex],
//         ...updateData
//     };

//     return NextResponse.json(designFeedback[feedbackIndex]);
// }

// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { feedbackId: string } }
// ) {
//     const feedbackId = params.feedbackId;

//     const feedbackIndex = designFeedback.findIndex(item => item.id === feedbackId);

//     if (feedbackIndex === -1) {
//         return NextResponse.json(
//             { error: 'Feedback not found' },
//             { status: 404 }
//         );
//     }

//     const deletedFeedback = designFeedback[feedbackIndex];
//     designFeedback.splice(feedbackIndex, 1);

//     return NextResponse.json({ success: true, deletedFeedback });
// } 