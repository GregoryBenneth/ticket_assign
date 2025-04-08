import { TeamMember } from "@/lib/types"



export const teamMembers: TeamMember[] = [
    {
        id: "1",
        name: "Alex Johnson",
        skills: ["frontend", "react", "ui"],
        workload: 0,
    },
    {
        id: "2",
        name: "Sam Taylor",
        skills: ["backend", "node", "api"],
        workload: 0,
    },
    {
        id: "3",
        name: "Jordan Lee",
        skills: ["database", "api", "testing"],
        workload: 0,
    },
    {
        id: "4",
        name: "Casey Morgan",
        skills: ["frontend", "design", "ui"],
        workload: 0,
    },
    {
        id: "5",
        name: "Riley Smith",
        skills: ["backend", "security", "database"],
        workload: 0,
    },
]


export const tickets = []


export function determineRequiredSkills(description: string): string[] {
    const skills = []

    const skillKeywords = {
        frontend: ["frontend", "ui", "interface", "design", "react", "css", "html"],
        backend: ["backend", "server", "api", "endpoint", "node"],
        database: ["database", "data", "storage", "query"],
        design: ["design", "layout", "ui", "ux", "user experience"],
        testing: ["test", "testing", "qa", "quality"],
        security: ["security", "authentication", "authorization", "secure"],
    }

    const lowercaseDesc = description.toLowerCase()

    Object.entries(skillKeywords).forEach(([skill, keywords]) => {
        if (keywords.some((keyword) => lowercaseDesc.includes(keyword))) {
            skills.push(skill)
        }
    })


    if (skills.length === 0) {
        skills.push("general")
    }

    return skills
}


export function assignTicketToTeamMember(requiredSkills: string[]): TeamMember | null {

    const eligibleMembers = teamMembers.filter((member) => requiredSkills.some((skill) => member.skills.includes(skill)))

    if (eligibleMembers.length === 0) {
        return null
    }


    const sortedMembers = [...eligibleMembers].sort((a, b) => {

        if (Math.abs(a.workload - b.workload) > 1) {
            return a.workload - b.workload
        }


        const aSkillMatch = requiredSkills.filter((skill) => a.skills.includes(skill)).length
        const bSkillMatch = requiredSkills.filter((skill) => b.skills.includes(skill)).length

        return bSkillMatch - aSkillMatch
    })


    return sortedMembers[0]
}
