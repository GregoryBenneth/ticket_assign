"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash } from "lucide-react";
import { toast } from "sonner";

import { format } from "date-fns";
import { Ticket } from "@/lib/types";
import { useState } from "react";

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export function TicketList({ tickets, isLoading }: TicketListProps) {
  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);

  if (tickets !== localTickets && !isLoading) {
    setLocalTickets(tickets);
  }

  const handleDeleteTicket = async (id: string) => {
    try {
      const response = await fetch(`/api/tickets?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao deletar o ticket");
      }

      setLocalTickets((prev) => prev.filter((ticket) => ticket.id !== id));
      toast("Ticket deleted successfully");

      window.location.reload();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast("Error", {
        description: "Failed to delete ticket. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (localTickets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No tickets found. Create a new ticket to get started.
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "assigned":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {localTickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardContent className="p-4 relative">
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted focus:outline-none">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Ticket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex justify-between items-start mb-2 pr-8">
              <h3 className="font-medium">{ticket.title}</h3>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              {ticket.description}
            </p>

            <div className="flex justify-between text-xs">
              <div>
                <span className="font-medium">Deadline:</span>{" "}
                {format(new Date(ticket.deadline), "MMM d, yyyy")}
              </div>

              {ticket.assignedTo && (
                <div>
                  <span className="font-medium">Assigned to:</span>{" "}
                  {ticket.assignedTo}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
