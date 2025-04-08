"use client";

import React, { useState, useEffect } from "react";
import { DesignViewer } from "@/components/design-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileIcon, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { DesignFile, DesignFeedback } from "@/lib/types";

export default function DesignFeedbackPage({
  params,
}: {
  params: { id: string };
}) {
  const [designFile, setDesignFile] = useState<DesignFile | null>(null);
  const [relatedVersions, setRelatedVersions] = useState<DesignFile[]>([]);
  const [feedback, setFeedback] = useState<DesignFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileId = React.useRef(params.id);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fileResponse = await fetch(`/api/files/${fileId}`);
        if (!fileResponse.ok) {
          throw new Error("Error fetching file data");
        }
        const fileData = await fileResponse.json();
        setDesignFile(fileData);

        const ticketResponse = await fetch(
          `/api/tickets/${fileData.ticketId}/files`
        );
        if (ticketResponse.ok) {
          const allFiles = await ticketResponse.json();
          const sameNameFiles = allFiles.filter(
            (file: DesignFile) => file.fileName === fileData.fileName
          );
          setRelatedVersions(sameNameFiles);
        }

        const feedbackResponse = await fetch(`/api/files/${fileId}/feedback`);
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          setFeedback(feedbackData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Could not load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fileId]);

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!designFile) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <FileIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">File not found</h2>
          <p className="text-muted-foreground mb-6">
            The requested file does not exist or has been removed.
          </p>
          <Link href="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href={`/tickets/${designFile.ticketId}/designs`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to designs</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">
          {designFile.fileName} (Version {designFile.version})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-0">
              <DesignViewer
                designFile={designFile}
                allVersions={relatedVersions}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Feedback ({feedback.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No feedback for this design yet.
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Click on the design to add annotations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium">
                          {item.createdBy}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm">{item.comment}</p>
                      {item.position && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Position: X: {Math.round(item.position.x)}%, Y:{" "}
                          {Math.round(item.position.y)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
