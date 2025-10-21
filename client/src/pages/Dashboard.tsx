import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare, Users, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Active Topics", value: "12", icon: BookOpen, change: "+3 this week" },
    { title: "Forum Posts", value: "45", icon: MessageSquare, change: "+8 today" },
    { title: "Subscriptions", value: "8", icon: Users, change: "2 new tutors" },
    { title: "Messages", value: "24", icon: TrendingUp, change: "5 unread" },
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: "New message from tutor", subject: "Advanced Programming", time: "2h ago" },
              { action: "Reply on forum post", subject: "Database Design Help", time: "5h ago" },
              { action: "Subscribed to topic", subject: "Web Development Basics", time: "1d ago" },
            ].map((activity, i) => (
              <div key={i} className="flex flex-col gap-1 pb-4 border-b last:border-0 last:pb-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.subject}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Scheduled tutoring sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { tutor: "Sarah Johnson", topic: "Data Structures", time: "Today, 3:00 PM" },
              { tutor: "Michael Chen", topic: "Software Engineering", time: "Tomorrow, 10:00 AM" },
              { tutor: "Emma Williams", topic: "Business Analytics", time: "Friday, 2:00 PM" },
            ].map((session, i) => (
              <div key={i} className="flex flex-col gap-1 pb-4 border-b last:border-0 last:pb-0">
                <p className="text-sm font-medium">{session.topic}</p>
                <p className="text-sm text-muted-foreground">with {session.tutor}</p>
                <p className="text-xs text-muted-foreground">{session.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
