import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch conversations
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ["/api/conversations"],
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/api/conversations", selectedChat, "messages"],
    enabled: !!selectedChat,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedChat) throw new Error("No conversation selected");
      const response = await apiRequest("POST", `/api/conversations/${selectedChat}/messages`, { content });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", selectedChat, "messages"] });
      setMessageInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;
    sendMessageMutation.mutate(messageInput);
  };

  const filteredConversations = (conversations as any[]).filter((conv: any) =>
    searchQuery === "" || 
    conv.tutorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.module?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations ? (conversations as any[]).find((c: any) => c.id === selectedChat) : null;

  if (isLoadingConversations) {
    return <div className="text-center py-8">Loading conversations...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Messages</h1>
        <p className="text-muted-foreground">Connect with your tutors and get personalized help</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        <Card className="flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No conversations yet</p>
              ) : (
                filteredConversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`w-full p-3 rounded-lg text-left hover-elevate active-elevate-2 ${
                      selectedChat === conv.id ? "bg-accent" : ""
                    }`}
                    data-testid={`button-conversation-${conv.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{(conv.tutorName || "U").split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{conv.tutorName || "Unknown"}</p>
                          {conv.unread > 0 && (
                            <Badge variant="default" className="h-5 px-2 text-xs">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1">{conv.module || "General"}</Badge>
                        <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage || "No messages yet"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{conv.timestamp || ""}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{(selectedConversation.tutorName || "U").split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedConversation.tutorName || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{selectedConversation.module || "General"}</p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                {isLoadingMessages ? (
                  <div className="text-center py-8">Loading messages...</div>
                ) : (
                  <div className="space-y-4">
                    {(messages as any[]).map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.isFromCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                          data-testid={`message-${msg.id}`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.isFromCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon" data-testid="button-attach">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={sendMessageMutation.isPending}
                    data-testid="input-message"
                  />
                  <Button type="submit" disabled={sendMessageMutation.isPending} data-testid="button-send">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
