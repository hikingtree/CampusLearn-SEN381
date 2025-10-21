import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, BookOpen } from "lucide-react";

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  module: string;
  tutorName?: string;
  creatorName?: string;
  tutorAvatar?: string;
  subscriberCount: number;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
}

export function TopicCard({
  id,
  title,
  description,
  module,
  tutorName,
  creatorName,
  tutorAvatar,
  subscriberCount,
  isSubscribed = false,
  onSubscribe,
}: TopicCardProps) {
  const displayName = tutorName || creatorName || "Unknown";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase();

  return (
    <Card className="hover-elevate" data-testid={`card-topic-${id}`}>
      <CardHeader className="gap-2 space-y-0 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={tutorAvatar} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{displayName}</span>
          </div>
          <Badge variant="secondary" className="text-xs" data-testid={`badge-module-${id}`}>
            <BookOpen className="h-3 w-3 mr-1" />
            {module}
          </Badge>
        </div>
        <CardTitle className="text-xl" data-testid={`text-topic-title-${id}`}>{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span data-testid={`text-subscribers-${id}`}>{subscriberCount} subscribers</span>
        </div>
        <Button
          size="sm"
          variant={isSubscribed ? "secondary" : "default"}
          onClick={onSubscribe}
          data-testid={`button-subscribe-${id}`}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
