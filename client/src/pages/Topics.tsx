import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { TopicCard } from "@/components/TopicCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Topics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", description: "", module: "" });
  const { toast } = useToast();

  const { data: topicsData, isLoading } = useQuery<any[]>({
    queryKey: ["/api/topics"],
  });

  const createTopicMutation = useMutation({
    mutationFn: async (topic: { title: string; description: string; module: string }) => {
      const response = await apiRequest("POST", "/api/topics", topic);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      toast({
        title: "Topic Created",
        description: "Your topic has been created successfully.",
      });
      setIsDialogOpen(false);
      setNewTopic({ title: "", description: "", module: "" });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    },
  });

  const subscribeTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const response = await apiRequest("POST", `/api/topics/${topicId}/subscribe`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
    },
    onError: () => {
      toast({
        title: "Subscription Failed",
        description: "Failed to toggle subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    createTopicMutation.mutate(newTopic);
  };

  const handleSubscribe = (id: string) => {
    subscribeTopicMutation.mutate(id);
  };

  const topics = topicsData || [];

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Topics</h1>
          <p className="text-muted-foreground">Browse and subscribe to learning topics</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-topic">
              <Plus className="h-4 w-4 mr-2" />
              Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateTopic}>
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogDescription>
                  Create a topic to get help from peer tutors
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-title">Topic Title</Label>
                  <Input
                    id="topic-title"
                    placeholder="e.g., Help with Recursion"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                    required
                    data-testid="input-topic-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-module">Module Code</Label>
                  <Input
                    id="topic-module"
                    placeholder="e.g., BIT 302"
                    value={newTopic.module}
                    onChange={(e) => setNewTopic({ ...newTopic, module: e.target.value })}
                    required
                    data-testid="input-topic-module"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-description">Description</Label>
                  <Textarea
                    id="topic-description"
                    placeholder="Describe what you need help with..."
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                    required
                    data-testid="input-topic-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" data-testid="button-submit-topic">Create Topic</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics or modules..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading topics...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              {...topic}
              onSubscribe={() => handleSubscribe(topic.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
