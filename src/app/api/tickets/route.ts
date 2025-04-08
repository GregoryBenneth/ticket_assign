import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { tickets, teamMembers, determineRequiredSkills, assignTicketToTeamMember } from "@/lib/data"
import type { Ticket } from "@/lib/types"


export async function GET() {
    return NextResponse.json(tickets)
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, description, deadline, teamMemberId } = body


        if (!title || !description || !deadline) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        let assignedMember = null
        let requiredSkills: string[] = []


        if (teamMemberId) {
            assignedMember = teamMembers.find((m) => m.id === teamMemberId)
        } else {

            requiredSkills = determineRequiredSkills(description)
            assignedMember = assignTicketToTeamMember(requiredSkills)
        }


        const newTicket: Ticket = {
            id: uuidv4(),
            title,
            description,
            deadline,
            status: assignedMember ? "assigned" : "pending",
            skills: requiredSkills,
            assignedTo: assignedMember?.name,
            createdAt: new Date().toISOString(),
        }


        if (assignedMember) {
            const memberIndex = teamMembers.findIndex((m) => m.id === assignedMember.id)
            if (memberIndex !== -1) {
                teamMembers[memberIndex].workload += 1
            }
        }

        //@ts-ignore
        tickets.push(newTicket as Ticket)

        return NextResponse.json(newTicket, { status: 201 })
    } catch (error) {
        console.error("Error creating ticket:", error)
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }
}


export async function PUT(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 })
        }

        const body = await request.json()
        //@ts-ignore
        const ticketIndex = tickets.findIndex((t) => t.id === id)

        if (ticketIndex === -1) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }


        const updatedTicket = {
            //@ts-ignore
            ...tickets[ticketIndex],
            ...body,
        }
        //@ts-ignore
        tickets[ticketIndex] = updatedTicket

        return NextResponse.json(updatedTicket)
    } catch (error) {
        console.error("Error updating ticket:", error)
        return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 })
        }


        //@ts-ignore
        const ticketIndex = tickets.findIndex((t) => t.id === id)


        if (ticketIndex === -1) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }


        const ticket = tickets[ticketIndex]
        //@ts-ignore
        if (ticket.assignedTo) {
            //@ts-ignore
            const memberIndex = teamMembers.findIndex((m) => m.name === ticket.assignedTo)
            if (memberIndex !== -1) {
                teamMembers[memberIndex].workload -= 1
            }
        }


        tickets.splice(ticketIndex, 1)

        return NextResponse.json({ message: "Ticket deleted successfully" })
    } catch (error) {
        console.error("Error deleting ticket:", error)
        return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
    }
}
