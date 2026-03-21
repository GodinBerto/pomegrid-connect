import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  from: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: { sender: "me" | "them"; text: string; time: string }[];
}

const mockConversations: Message[] = [
  {
    id: "1", from: "Takeshi Yamamoto", preview: "We're interested in 2,000kg of your Hass Avocados.", time: "10:32 AM", unread: true,
    messages: [
      { sender: "them", text: "Hello! We saw your avocado listing. Very interested in bulk order.", time: "10:28 AM" },
      { sender: "them", text: "We're interested in 2,000kg of your Hass Avocados.", time: "10:32 AM" },
    ],
  },
  {
    id: "2", from: "Johan van der Berg", preview: "Can you share the certification documents?", time: "Yesterday", unread: false,
    messages: [
      { sender: "them", text: "Hi, great products! Can you share the certification documents?", time: "Yesterday" },
      { sender: "me", text: "Of course, I'll send them over shortly.", time: "Yesterday" },
    ],
  },
  {
    id: "3", from: "Li Wei", preview: "What's your minimum order quantity for cashews?", time: "2 days ago", unread: false,
    messages: [
      { sender: "them", text: "What's your minimum order quantity for cashews?", time: "2 days ago" },
    ],
  },
];

export const MessagesTab = () => {
  const [conversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, { sender: "me" | "them"; text: string; time: string }[]>>({});

  const active = conversations.find(c => c.id === activeId);
  const msgs = active ? [...active.messages, ...(localMessages[active.id] || [])] : [];

  const sendMsg = () => {
    if (!newMsg.trim() || !activeId) return;
    setLocalMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), { sender: "me", text: newMsg, time: "Just now" }],
    }));
    setNewMsg("");
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold">Messages</h2>
      <div className="bg-card rounded-xl border border-border shadow-sm flex h-[calc(100vh-220px)] min-h-[400px]">
        {/* Sidebar */}
        <div className={`w-full sm:w-80 border-r border-border flex flex-col ${activeId ? "hidden sm:flex" : "flex"}`}>
          <div className="p-3 border-b border-border">
            <Input placeholder="Search messages..." className="h-9" />
          </div>
          <div className="flex-1 overflow-auto divide-y divide-border">
            {conversations.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left p-4 hover:bg-muted/30 transition-colors ${activeId === c.id ? "bg-muted/40" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold shrink-0">
                    {c.from.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{c.from}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                  </div>
                  {c.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className={`flex-1 flex flex-col ${!activeId ? "hidden sm:flex" : "flex"}`}>
          {active ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <button className="sm:hidden text-sm text-primary" onClick={() => setActiveId(null)}>← Back</button>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold">
                  {active.from.split(" ").map(n => n[0]).join("")}
                </div>
                <p className="font-medium text-sm">{active.from}</p>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      m.sender === "me" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"
                    }`}>
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMsg()}
                />
                <Button size="icon" onClick={sendMsg} disabled={!newMsg.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
