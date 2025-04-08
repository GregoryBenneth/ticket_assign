"use client";

import { useState, useEffect } from "react";
import { TicketForm } from "@/components/ticket-form";
import { TicketList } from "@/components/ticket-list";
import type { Ticket } from "@/lib/types";

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  console.log(tickets);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets((prev) => [...prev, newTicket]);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Ticket Assignment System
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Submit New Ticket</h2>
          <TicketForm onTicketCreated={handleTicketCreated} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Ticket List</h2>
          <TicketList tickets={tickets} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
