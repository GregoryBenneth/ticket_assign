import { NextRequest, NextResponse } from 'next/server';
import { generateUniqueId } from '@/lib/utils';
import type { DesignFeedback, DesignFile } from '@/lib/types';

let designFeedback: DesignFeedback[] = [];
let designFiles: DesignFile[] = [];

export async function GET(
    request: NextRequest,
    { params }: { params: { fileId: string } }
) {
    const fileId = params.fileId;

    const file = designFiles.find(file => file.id === fileId);

    if (!file) {
        return NextResponse.json(
            { error: 'File not found' },
            { status: 404 }
        );
    }

    const feedback = designFeedback.filter(item => item.designFileId === fileId);

    return NextResponse.json(feedback);
}

export async function POST(
    request: NextRequest,
    { params }: { params: { fileId: string } }
) {
    const fileId = params.fileId;

    const file = designFiles.find(file => file.id === fileId);

    if (!file) {
        return NextResponse.json(
            { error: 'File not found' },
            { status: 404 }
        );
    }

    try {
        const { comment, position, createdBy } = await request.json();

        if (!comment) {
            return NextResponse.json(
                { error: 'Comment is required' },
                { status: 400 }
            );
        }

        const newFeedback: DesignFeedback = {
            id: generateUniqueId(),
            designFileId: fileId,
            comment,
            position,
            createdAt: new Date().toISOString(),
            createdBy: createdBy || 'anonymous'
        };

        designFeedback.push(newFeedback);

        return NextResponse.json(newFeedback, { status: 201 });
    } catch (error) {
        console.error('Error adding feedback:', error);
        return NextResponse.json(
            { error: 'Failed to add feedback' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { fileId: string } }
) {
    const fileId = params.fileId;

    const file = designFiles.find(file => file.id === fileId);

    if (!file) {
        return NextResponse.json(
            { error: 'File not found' },
            { status: 404 }
        );
    }

    const initialCount = designFeedback.length;

    designFeedback = designFeedback.filter(item => item.designFileId !== fileId);

    const deletedCount = initialCount - designFeedback.length;

    return NextResponse.json({ deletedCount });
} 