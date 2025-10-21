import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, TrendingUp } from "lucide-react";
import { ForumPost } from "@/components/ForumPost";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", isAnonymous: false });
  const { toast } = useToast();

  // Fetch forum posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/forum/posts"],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; isAnonymous: boolean }) => {
      const response = await apiRequest("POST", "/api/forum/posts", postData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Post Created",
        description: "Your forum post has been published successfully",
      });
      setIsDialogOpen(false);
      setNewPost({ title: "", content: "", isAnonymous: false });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const filteredPosts = (posts as any[]).filter((post: any) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading forum posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Public Forum</h1>
          <p className="text-muted-foreground">Ask questions and share knowledge with the community</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-post">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreatePost}>
              <DialogHeader>
                <DialogTitle>Create Forum Post</DialogTitle>
                <DialogDescription>
                  Ask a question or share knowledge with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    placeholder="What's your question?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                    data-testid="input-post-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-content">Content</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Provide details about your question..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    required
                    className="min-h-32"
                    data-testid="input-post-content"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="anonymous"
                    checked={newPost.isAnonymous}
                    onCheckedChange={(checked) => setNewPost({ ...newPost, isAnonymous: checked as boolean })}
                    data-testid="checkbox-anonymous"
                  />
                  <Label htmlFor="anonymous" className="font-normal">
                    Post anonymously
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createPostMutation.isPending} data-testid="button-submit-post">
                  {createPostMutation.isPending ? "Creating..." : "Post Question"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forum posts..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent" data-testid="tab-recent">Recent</TabsTrigger>
          <TabsTrigger value="trending" data-testid="tab-trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="unanswered" data-testid="tab-unanswered">Unanswered</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {filteredPosts.map((post) => (
            <ForumPost key={post.id} {...post} />
          ))}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          {filteredPosts
            .sort((a, b) => b.upvotes - a.upvotes)
            .map((post) => (
              <ForumPost key={post.id} {...post} />
            ))}
        </TabsContent>

        <TabsContent value="unanswered" className="space-y-4">
          <p className="text-center text-muted-foreground py-8">No unanswered posts at the moment</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
