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
}
