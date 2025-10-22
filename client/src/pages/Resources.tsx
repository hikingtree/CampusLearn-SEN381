import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Upload, Download } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { File as FileType, Topic, TopicSubscription } from "@shared/schema";

interface FileWithUploader extends FileType {
  uploaderName: string;
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: subscriptions = [] } = useQuery<TopicSubscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  const { data: allFiles = [] } = useQuery<FileWithUploader[]>({
    queryKey: ["/api/files"],
    enabled: true,
  });

  const { data: userFiles = [] } = useQuery<Array<FileType & { context: string }>>({
    queryKey: ["/api/files/user"],
  });

  // Get subscribed topics for upload
  const subscribedTopics = topics.filter(topic =>
    subscriptions.some(sub => sub.topicId === topic.id)
  );

  const filteredFiles = allFiles.filter(file => {
    const topic = topics.find(t => t.id === file.topicId);
    const matchesSearch = 
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic?.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    setSelectedTopicId("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Learning Resources</h1>
          <p className="text-muted-foreground">Browse and share study materials</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-upload-resource">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Learning Resource</DialogTitle>
              <DialogDescription>
                Share study materials with your peers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Topic</Label>
                {subscribedTopics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Subscribe to topics first to upload resources
                  </p>
                ) : (
                  <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                    <SelectTrigger data-testid="select-topic">
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscribedTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {selectedTopicId && (
                <FileUpload 
                  topicId={selectedTopicId} 
                  onUploadComplete={handleUploadComplete}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-resources">
            All Resources
          </TabsTrigger>
          <TabsTrigger value="my-uploads" data-testid="tab-my-uploads">
            My Uploads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>

          {filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No resources found. Be the first to share learning materials!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map((file) => {
                const topic = topics.find(t => t.id === file.topicId);
                return (
                  <Card key={file.id} data-testid={`card-file-${file.id}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{file.fileName}</CardTitle>
                          <CardDescription className="mt-1">
                            {topic?.title || "Unknown Topic"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Uploaded by {file.uploaderName}</p>
                        <p>{new Date(file.createdAt).toLocaleDateString()}</p>
                        <p>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(file.fileUrl, '_blank')}
                        data-testid={`button-view-${file.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-uploads" className="space-y-4">
          {userFiles.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  You haven't uploaded any resources yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userFiles.map((file) => (
                <Card key={file.id} data-testid={`card-my-file-${file.id}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{file.fileName}</CardTitle>
                        <CardDescription className="mt-1">
                          {file.context}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{new Date(file.createdAt).toLocaleDateString()}</p>
                      <p>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(file.fileUrl, '_blank')}
                      data-testid={`button-view-my-${file.id}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
