import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";

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

  const handleUpvote = () => {
    if (voted) {
      setVoteCount(prev => prev - 1);
    } else {
      setVoteCount(prev => prev + 1);
    }
    setVoted(!voted);
    console.log(`Upvote toggled for post ${id}`);
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
      <CardFooter className="pl-16 pt-0">
        <Button variant="ghost" size="sm" data-testid={`button-reply-${id}`}>
          <MessageSquare className="h-4 w-4 mr-2" />
          {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
        </Button>
      </CardFooter>
    </Card>
  );
}
