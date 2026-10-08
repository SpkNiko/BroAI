import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { ChatClient } from "@/components/chat-client";

export default async function ChatPage() {
  const user =
    await requireUser();

  return (
    <AppShell
      user={user}
      title="Gadanie"
    >
      <ChatClient mode="CHAT" />
    </AppShell>
  );
}
