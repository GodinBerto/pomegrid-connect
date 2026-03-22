import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  ApiError,
  fetchSupportConversation,
  fetchSupportMessages,
  markSupportMessagesRead,
  sendSupportMessage,
} from "@/lib/api";
import { toast } from "sonner";

export const MessagesTab = () => {
  const queryClient = useQueryClient();
  const { accessToken, user } = useAuth();
  const [newMsg, setNewMsg] = useState("");

  const conversationQuery = useQuery({
    queryKey: ["support-conversation", accessToken],
    queryFn: () => fetchSupportConversation(accessToken!),
    enabled: !!accessToken,
  });

  const messagesQuery = useQuery({
    queryKey: ["support-messages", accessToken],
    queryFn: () => fetchSupportMessages(accessToken!),
    enabled: !!accessToken,
  });

  const sendMutation = useMutation({
    mutationFn: () => sendSupportMessage(accessToken!, newMsg.trim()),
    onSuccess: () => {
      setNewMsg("");
      queryClient.invalidateQueries({ queryKey: ["support-conversation"] });
      queryClient.invalidateQueries({ queryKey: ["support-messages"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Unable to send message.");
    },
  });

  useEffect(() => {
    if (!accessToken || !messagesQuery.data?.length) {
      return;
    }
    markSupportMessagesRead(accessToken).catch(() => {
      // Best effort only.
    });
  }, [accessToken, messagesQuery.data]);

  const sendMsg = () => {
    if (!newMsg.trim()) {
      return;
    }
    sendMutation.mutate();
  };

  const messages = [...(messagesQuery.data ?? [])].sort(
    (left, right) =>
      new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  );

  const conversation = conversationQuery.data;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Messages</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Use the built-in support chat to get help or request an introduction.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm flex h-[calc(100vh-220px)] min-h-[420px] overflow-hidden">
        <div className="w-full sm:w-80 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <Input value="Support Team" readOnly className="h-9 text-muted-foreground" />
          </div>
          <div className="flex-1 overflow-auto divide-y divide-border">
            <div className="w-full text-left p-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold shrink-0">
                  ST
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">Support Team</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {conversation?.last_message_at
                        ? new Date(conversation.last_message_at).toLocaleDateString()
                        : "Open"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation?.latest_message ??
                      "Start the conversation when you are ready."}
                  </p>
                </div>
                {(conversation?.unread_count ?? 0) > 0 ? (
                  <span className="min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center px-1">
                    {conversation?.unread_count}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold">
              ST
            </div>
            <div>
              <p className="font-medium text-sm">Support Team</p>
              <p className="text-xs text-muted-foreground">
                Request introductions, support, or account help.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messagesQuery.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading messages...</div>
            ) : messagesQuery.isError ? (
              <div className="text-sm text-destructive">
                {messagesQuery.error instanceof Error
                  ? messagesQuery.error.message
                  : "Unable to load messages."}
              </div>
            ) : messages.length ? (
              messages.map((message) => {
                const isMine = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isMine
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm text-center">
                Start the conversation with support. They can help with your
                account and trading requests.
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMsg}
              onChange={(event) => setNewMsg(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMsg();
                }
              }}
            />
            <Button
              size="icon"
              onClick={sendMsg}
              disabled={!newMsg.trim() || sendMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
