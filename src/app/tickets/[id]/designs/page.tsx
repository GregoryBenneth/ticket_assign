"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "@/components/file-uploader";
import { DesignViewer } from "@/components/design-viewer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileIcon, History } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { DesignFile, Ticket } from "@/lib/types";

export default function TicketDesignsPage() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [designFiles, setDesignFiles] = useState<DesignFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const ticketId = "test";

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      try {
        const ticketResponse = await fetch(`/api/tickets/${ticketId}`);
        if (!ticketResponse.ok) {
          throw new Error("Error fetching ticket data");
        }
        const ticketData = await ticketResponse.json();
        setTicket(ticketData);

        const filesResponse = await fetch(`/api/tickets/${ticketId}/files`);
        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          setDesignFiles(filesData);

          if (filesData.length > 0) {
            setSelectedFileId(filesData[0].id);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Could not load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleFileUploaded = (newFile: DesignFile) => {
    setDesignFiles((prev) => [...prev, newFile]);
    setSelectedFileId(newFile.id);
    toast.success("File uploaded successfully!");
  };

  const selectedFile = designFiles.find((file) => file.id === selectedFileId);
  const filesByName: Record<string, DesignFile[]> = {};

  designFiles.forEach((file) => {
    if (!filesByName[file.fileName]) {
      filesByName[file.fileName] = [];
    }
    filesByName[file.fileName].push(file);
  });

  Object.keys(filesByName).forEach((fileName) => {
    filesByName[fileName].sort((a, b) => a.version - b.version);
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href={`/tickets/${ticketId}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to ticket</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">
          {isLoading ? "Loading..." : ticket?.title || "Ticket Designs"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {selectedFile ? (
            <DesignViewer
              designFile={selectedFile}
              allVersions={filesByName[selectedFile.fileName] || []}
            />
          ) : (
            <Card className="flex items-center justify-center h-[60vh]">
              <div className="text-center p-8">
                <FileIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No file selected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a file from the list or upload a new design
                </p>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Tabs defaultValue="upload">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="files">
                Files ({designFiles.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload new design</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    ticketId={ticketId}
                    onFileUploaded={handleFileUploaded}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="files" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded designs</CardTitle>
                </CardHeader>
                <CardContent>
                  {designFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <FileIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No design files uploaded
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(filesByName).map(([fileName, files]) => (
                        <div
                          key={fileName}
                          className="border rounded-md overflow-hidden"
                        >
                          <div className="bg-muted px-3 py-2 font-medium">
                            {fileName}
                          </div>
                          <div className="divide-y">
                            {files.map((file) => (
                              <button
                                key={file.id}
                                className={`w-full flex items-center px-3 py-2 hover:bg-muted/50 text-left ${
                                  selectedFileId === file.id
                                    ? "bg-primary/10"
                                    : ""
                                }`}
                                onClick={() => setSelectedFileId(file.id)}
                              >
                                <div>
                                  <div className="flex items-center gap-1">
                                    <History className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">
                                      Version {file.version}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(
                                      file.uploadedAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
