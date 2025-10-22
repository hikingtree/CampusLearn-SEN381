import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface FileUploadProps {
  topicId?: string;
  conversationId?: string;
  onUploadComplete?: () => void;
}

export function FileUpload({ topicId, conversationId, onUploadComplete }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 50MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (topicId) {
        formData.append("topicId", topicId);
      }
      if (conversationId) {
        formData.append("conversationId", conversationId);
      }

      const response = await fetch("/api/files/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully",
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/user"] });
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: ["/api/topics", topicId, "files"] });
      }
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "files"] });
      }

      // Reset state
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadComplete?.();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Upload Learning Material</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Share PDFs, documents, videos, or other resources (max 50MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="input-file"
          />

          {selectedFile ? (
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRemoveFile}
                disabled={isUploading}
                data-testid="button-remove-file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              data-testid="button-select-file"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          )}

          {selectedFile && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
              data-testid="button-upload"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
