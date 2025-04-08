// import { NextRequest, NextResponse } from 'next/server';
// import { generateUniqueId, getFileExtension, getLatestFileVersion } from '@/lib/utils';
// import type { DesignFile } from '@/lib/types';

// let designFiles: DesignFile[] = [];

// export async function GET(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     const ticketId = params.id;

//     const files = designFiles.filter(file => file.ticketId === ticketId);

//     return NextResponse.json(files);
// }

// export async function POST(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     const ticketId = params.id;

//     try {
//         const formData = await request.formData();
//         const file = formData.get('file') as File;
//         const uploadedBy = formData.get('uploadedBy') as string;

//         if (!file) {
//             return NextResponse.json(
//                 { error: 'No file uploaded' },
//                 { status: 400 }
//             );
//         }

//         const fileBuffer = await file.arrayBuffer();
//         const fileSize = fileBuffer.byteLength;

//         const fileUrl = `/uploads/${ticketId}/${file.name}`;

//         const version = getLatestFileVersion(
//             designFiles.filter(f => f.ticketId === ticketId),
//             file.name
//         );

//         const newFile: DesignFile = {
//             id: generateUniqueId(),
//             ticketId,
//             fileName: file.name,
//             fileUrl,
//             fileSize,
//             fileType: getFileExtension(file.name),
//             version,
//             uploadedAt: new Date().toISOString(),
//             uploadedBy: uploadedBy || 'anonymous'
//         };

//         designFiles.push(newFile);

//         return NextResponse.json(newFile, { status: 201 });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return NextResponse.json(
//             { error: 'Failed to upload file' },
//             { status: 500 }
//         );
//     }
// }
// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     const ticketId = params.id;

//     const initialCount = designFiles.length;
//     designFiles = designFiles.filter(file => file.ticketId !== ticketId);

//     const deletedCount = initialCount - designFiles.length;

//     return NextResponse.json({ deletedCount });
// }
