export interface TeamMember {
    id: string
    name: string
    skills: string[]
    workload: number
}

export interface Ticket {
    id: string
    title: string
    description: string
    deadline: string
    status: "pending" | "assigned" | "completed"
    skills?: string[]
    assignedTo?: string
    createdAt: string
    designFiles?: DesignFile[]
}

export interface DesignFile {
    id: string
    ticketId: string
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
    version: number
    uploadedAt: string
    uploadedBy: string
}

export interface DesignFeedback {
    id: string
    designFileId: string
    comment: string
    position?: { x: number, y: number }
    createdAt: string
    createdBy: string
}
