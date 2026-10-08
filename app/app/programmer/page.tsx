import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { CodeWorkspace } from "@/components/code-workspace";

export default async function ProgrammerPage() {
  const user =
    await requireUser();

  return (
    <AppShell
      user={user}
      title="Programista"
    >
      <CodeWorkspace />
    </AppShell>
  );
}
