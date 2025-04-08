// import { NextRequest, NextResponse } from 'next/server';
// import type { DesignFile } from '@/lib/types';


// let designFiles: DesignFile[] = [];


// export async function GET(
//     request: NextRequest,
//     { params }: { params: { fileId: string } }
// ) {
//     const fileId = params.fileId;

//     const file = designFiles.find(file => file.id === fileId);

//     if (!file) {
//         return NextResponse.json(
//             { error: 'File not found' },
//             { status: 404 }
//         );
//     }

//     return NextResponse.json(file);
// }

// export async function PATCH(
//     request: NextRequest,
//     { params }: { params: { fileId: string } }
// ) {
//     const fileId = params.fileId;
//     const updateData = await request.json();

//     const protectedFields = ['id', 'ticketId', 'fileUrl', 'fileSize', 'fileType', 'uploadedAt', 'version'];

//     protectedFields.forEach(field => {
//         if (field in updateData) {
//             delete updateData[field];
//         }
//     });

//     const fileIndex = designFiles.findIndex(file => file.id === fileId);

//     if (fileIndex === -1) {
//         return NextResponse.json(
//             { error: 'File not found' },
//             { status: 404 }
//         );
//     }

//     designFiles[fileIndex] = {
//         ...designFiles[fileIndex],
//         ...updateData
//     };

//     return NextResponse.json(designFiles[fileIndex]);
// }

// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { fileId: string } }
// ) {
//     const fileId = params.fileId;

//     const fileIndex = designFiles.findIndex(file => file.id === fileId);

//     if (fileIndex === -1) {
//         return NextResponse.json(
//             { error: 'File not found' },
//             { status: 404 }
//         );
//     }

//     const deletedFile = designFiles[fileIndex];
//     designFiles.splice(fileIndex, 1);

//     return NextResponse.json({ success: true, deletedFile });
// } 