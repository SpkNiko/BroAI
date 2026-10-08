import {
  Image as ImageIcon,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { ImageGenerator } from "@/components/image-generator";

export default async function ImagesPage() {
  const user =
    await requireUser();

  return (
    <AppShell
      user={user}
      title="Obrazy"
    >
      <div className="content stack">
        <section className="hero">
          <div className="row small muted">
            <ImageIcon size={14} />
            IMAGE GENERATOR
          </div>

          <h1>Twórz obrazy.</h1>

          <p>
            Opisz grafikę, wybierz
            rozmiar i jakość, a
            BroAI wygeneruje obraz.
          </p>
        </section>

        <ImageGenerator />
      </div>
    </AppShell>
  );
}
