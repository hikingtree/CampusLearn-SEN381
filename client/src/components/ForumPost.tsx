import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  timestamp: string;
  upvotes: number;
  replyCount: number;
  tags: string[];
  hasUpvoted?: boolean;
}

export function ForumPost({
  id,
  title,
  content,
  author,
  isAnonymous,
  timestamp,
  upvotes,
  replyCount,
  tags,
  hasUpvoted = false,
}: ForumPostProps) {
  const [voted, setVoted] = useState(hasUpvoted);
  const [voteCount, setVoteCount] = useState(upvotes);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyAnonymous, setReplyAnonymous] = useState(false);
  const { toast } = useToast();

  // Fetch replies when expanded
  const { data: replies = [], isLoading: isLoadingReplies } = useQuery({
    queryKey: [`/api/forum/posts/${id}/replies`],
    enabled: showReplies,
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (replyData: { content: string; isAnonymous: boolean }) => {
      const response = await apiRequest("POST", `/api/forum/posts/${id}/replies`, replyData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forum/posts/${id}/replies`] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Reply Posted",
        description: "Your reply has been added successfully",
      });
      setReplyContent("");
      setReplyAnonymous(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Post Reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpvote = () => {
    if (voted) {
      setVoteCount(prev => prev - 1);
    } else {
      setVoteCount(prev => prev + 1);
    }
    setVoted(!voted);
    console.log(`Upvote toggled for post ${id}`);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Reply content is required",
        variant: "destructive",
      });
      return;
    }
    createReplyMutation.mutate({ content: replyContent, isAnonymous: replyAnonymous });
  };

  return (
    <Card data-testid={`card-post-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col h-auto p-2 ${voted ? "text-primary" : ""}`}
            onClick={handleUpvote}
            data-testid={`button-upvote-${id}`}
          >
            <ArrowUp className="h-5 w-5" />
            <span className="text-sm font-semibold" data-testid={`text-upvotes-${id}`}>{voteCount}</span>
          </Button>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold" data-testid={`text-post-title-${id}`}>{title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{isAnonymous ? "Anonymous" : author}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-16 pb-3">
        <p className="text-sm" data-testid={`text-post-content-${id}`}>{content}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pl-16 pt-0 flex-col items-start gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowReplies(!showReplies)}
          data-testid={`button-toggle-replies-${id}`}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
        </Button>

        {showReplies && (
          <div className="w-full space-y-4">
            {isLoadingReplies ? (
              <p className="text-sm text-muted-foreground">Loading replies...</p>
            ) : (
              <>
                {(replies as any[]).length > 0 && (
                  <div className="space-y-3">
                    {(replies as any[]).map((reply: any) => (
                      <div key={reply.id} className="border-l-2 pl-4 space-y-1" data-testid={`reply-${reply.id}`}>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{reply.authorName}</span>
                          <span>•</span>
                          <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm" data-testid={`text-reply-content-${reply.id}`}>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmitReply} className="space-y-3">
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-20"
                    data-testid={`input-reply-content-${id}`}
                  />
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`reply-anonymous-${id}`}
                        checked={replyAnonymous}
                        onCheckedChange={(checked) => setReplyAnonymous(checked as boolean)}
                        data-testid={`checkbox-reply-anonymous-${id}`}
                      />
                      <Label htmlFor={`reply-anonymous-${id}`} className="font-normal text-sm">
                        Reply anonymously
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={createReplyMutation.isPending}
                      data-testid={`button-submit-reply-${id}`}
                    >
                      {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
