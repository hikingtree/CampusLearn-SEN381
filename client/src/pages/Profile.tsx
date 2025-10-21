import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { fullName?: string; bio?: string }) => {
      const response = await apiRequest("PATCH", "/api/profile", updates);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Only submit if in editing mode
    if (!isEditing) return;
    updateProfileMutation.mutate(formData);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (profileData) {
      const currentData = {
        fullName: (profileData as any).fullName || "",
        bio: (profileData as any).bio || "",
      };
      setFormData(currentData);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setFormData({ fullName: "", bio: "" });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  const profile: any = profileData || {};

  const resources = [
    { id: "1", name: "Recursion Examples.pdf", type: "PDF", uploadedBy: "Sarah Johnson", date: "2 days ago" },
    { id: "2", name: "SQL Joins Tutorial.mp4", type: "Video", uploadedBy: "Michael Chen", date: "5 days ago" },
    { id: "3", name: "React Best Practices.pdf", type: "PDF", uploadedBy: "David Lee", date: "1 week ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  {profile.fullName ? profile.fullName.split(" ").map((n: string) => n[0]).join("") : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{profile.fullName || "User"}</h3>
                <p className="text-sm text-muted-foreground">{profile.studentId || ""}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Tutor Status</p>
              <Badge variant={profile.isTutor ? "default" : "secondary"}>
                {profile.isTutor ? "Peer Tutor" : "Student"}
              </Badge>
            </div>
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Topics Subscribed</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Forum Posts</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Helpful Answers</span>
                <span className="font-medium">24</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" data-testid="tab-profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile Info
                </TabsTrigger>
                <TabsTrigger value="resources" data-testid="tab-resources">
                  <FileText className="h-4 w-4 mr-2" />
                  Saved Resources
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="profile">
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={isEditing ? formData.fullName : profile.fullName || ""}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                      data-testid="input-fullname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || ""}
                      disabled
                      data-testid="input-email"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={profile.studentId || ""}
                      disabled
                      data-testid="input-studentid"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={isEditing ? formData.bio : profile.bio || ""}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      data-testid="input-bio"
                    />
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button type="submit" disabled={updateProfileMutation.isPending} data-testid="button-save">
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleCancelEdit} data-testid="button-cancel">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={handleEditClick} data-testid="button-edit">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="resources">
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                      data-testid={`resource-${resource.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">
                            By {resource.uploadedBy} • {resource.date}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" data-testid={`button-download-${resource.id}`}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
