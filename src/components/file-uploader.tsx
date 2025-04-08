"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/utils";
import type { DesignFile } from "@/lib/types";

interface FileUploaderProps {
  ticketId: string;
  onFileUploaded: (file: DesignFile) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function FileUploader({
  ticketId,
  onFileUploaded,
  maxSizeMB = 10,
  allowedTypes = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "svg",
    "ai",
    "psd",
    "sketch",
    "figma",
  ],
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size: ${maxSizeMB}MB`);
      return false;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedTypes.includes(fileExt)) {
      toast.error(
        `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("uploadedBy", "current-user");

      const response = await fetch(`/api/tickets/${ticketId}/files`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const uploadedFile = await response.json();
      onFileUploaded(uploadedFile);

      toast.success("File uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="p-4 border rounded-md bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSelection}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            {formatFileSize(selectedFile.size)}
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload file"}
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            isDragging
              ? "border-primary bg-muted/50"
              : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept={allowedTypes.map((type) => `.${type}`).join(",")}
          />
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <div className="text-sm mb-2">
            <span className="font-medium">Drag and drop a file</span> or{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              click to select
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Allowed types: {allowedTypes.join(", ")}
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum size: {maxSizeMB}MB
          </p>
        </div>
      )}
    </div>
  );
}
