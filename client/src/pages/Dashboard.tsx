import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/useAuth";
import type { Topic, TopicSubscription, ForumPost, Conversation } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: subscriptions = [] } = useQuery<TopicSubscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  const { data: forumPosts = [] } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum/posts"],
  });

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  // Calculate stats
  const totalTopics = topics.length;
  const totalForumPosts = forumPosts.length;
  const totalSubscriptions = subscriptions.length;
  const totalConversations = conversations.length;

  // Get recent subscriptions
  const recentSubscriptions = subscriptions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get user's recent forum posts
  const userForumPosts = forumPosts
    .filter(post => post.authorId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = [
    { title: "Active Topics", value: totalTopics.toString(), icon: BookOpen, change: `${subscriptions.length} subscribed` },
    { title: "Forum Posts", value: totalForumPosts.toString(), icon: MessageSquare, change: `${userForumPosts.length} by you` },
    { title: "Subscriptions", value: totalSubscriptions.toString(), icon: Users, change: "Your topics" },
    { title: "Conversations", value: totalConversations.toString(), icon: TrendingUp, change: "Active chats" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-stat-value-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
            <CardDescription>Topics you recently joined</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subscriptions yet. Browse topics to get started!</p>
            ) : (
              recentSubscriptions.map((subscription) => {
                const topic = topics.find(t => t.id === subscription.topicId);
                if (!topic) return null;
                
                return (
                  <div key={subscription.id} className="flex flex-col gap-1 pb-4 border-b last:border-0 last:pb-0">
                    <p className="text-sm font-medium">{topic.title}</p>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Recent Posts</CardTitle>
            <CardDescription>Forum discussions you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userForumPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No forum posts yet. Start a discussion!</p>
            ) : (
              userForumPosts.map((post) => (
                <div key={post.id} className="flex flex-col gap-1 pb-4 border-b last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
