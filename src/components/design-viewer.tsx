"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  MessageSquare,
  Plus,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { DesignFile, DesignFeedback } from "@/lib/types";
import { generateUniqueId } from "@/lib/utils";

interface DesignViewerProps {
  designFile: DesignFile;
  allVersions?: DesignFile[];
  readOnly?: boolean;
}

export function DesignViewer({
  designFile,
  allVersions = [],
  readOnly = false,
}: DesignViewerProps) {
  const [feedback, setFeedback] = useState<DesignFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [newPinPosition, setNewPinPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<DesignFile>(designFile);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/files/${currentVersion.id}/feedback`
        );
        if (response.ok) {
          const data = await response.json();
          setFeedback(data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to load feedback");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [currentVersion.id]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (readOnly || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewPinPosition({ x, y });
    setAddingComment(true);
  };

  const handleSaveComment = async () => {
    if (!newPinPosition || !newComment.trim()) return;

    try {
      const newFeedbackItem: DesignFeedback = {
        id: generateUniqueId(),
        designFileId: currentVersion.id,
        comment: newComment,
        position: newPinPosition,
        createdAt: new Date().toISOString(),
        createdBy: "current-user",
      };

      const response = await fetch(`/api/files/${currentVersion.id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newComment,
          position: newPinPosition,
          createdBy: "current-user",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add feedback");
      }

      const savedFeedback = await response.json();
      setFeedback((prev) => [...prev, savedFeedback]);
      toast.success("Feedback added successfully");
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("Error adding feedback");
    } finally {
      setNewComment("");
      setNewPinPosition(null);
      setAddingComment(false);
    }
  };

  const handleDownload = () => {
    window.open(currentVersion.fileUrl, "_blank");
    toast.success("Download started");
  };

  const handleVersionChange = (direction: "prev" | "next") => {
    if (!allVersions.length) return;

    const currentIndex = allVersions.findIndex(
      (v) => v.id === currentVersion.id
    );
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allVersions.length - 1;
    } else {
      newIndex = currentIndex < allVersions.length - 1 ? currentIndex + 1 : 0;
    }

    setCurrentVersion(allVersions[newIndex]);
    setActivePin(null);
  };

  const handleCancelAddPin = () => {
    setNewPinPosition(null);
    setNewComment("");
    setAddingComment(false);
  };

  return (
    <div className="w-full bg-muted/30 rounded-lg p-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          {allVersions.length > 0 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVersionChange("prev")}
                title="Previous version"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm">
                Version {currentVersion.version} of {allVersions.length}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVersionChange("next")}
                title="Next version"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
      </div>

      <div className="relative bg-background rounded-md overflow-hidden">
        <div className="relative">
          <img
            ref={imageRef}
            src={currentVersion.fileUrl}
            alt={currentVersion.fileName}
            className="w-full h-auto object-contain max-h-[70vh]"
            onClick={!readOnly ? handleImageClick : undefined}
            style={{ cursor: readOnly ? "default" : "crosshair" }}
          />

          {feedback.map(
            (item) =>
              item.position && (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={`absolute w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform ${
                          activePin === item.id
                            ? "ring-2 ring-primary ring-offset-2"
                            : ""
                        }`}
                        style={{
                          left: `${item.position.x}%`,
                          top: `${item.position.y}%`,
                        }}
                        onClick={() =>
                          setActivePin(activePin === item.id ? null : item.id)
                        }
                      >
                        <MessageSquare className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[200px] text-sm">
                        {item.comment.length > 30
                          ? item.comment.substring(0, 30) + "..."
                          : item.comment}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
          )}

          {newPinPosition && !addingComment && (
            <div
              className="absolute w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{
                left: `${newPinPosition.x}%`,
                top: `${newPinPosition.y}%`,
              }}
            >
              <Plus className="h-4 w-4" />
            </div>
          )}
        </div>

        {activePin && (
          <div className="absolute bottom-0 right-0 bg-background/95 border rounded-tl-md p-4 max-w-md shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Feedback</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setActivePin(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {feedback.find((f) => f.id === activePin)?.comment}
          </div>
        )}
      </div>

      <Dialog
        open={addingComment}
        onOpenChange={(open: boolean) => !open && handleCancelAddPin()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Type your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSaveComment}
              disabled={!newComment.trim()}
              className="gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
