import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AboutPanel } from "@/components/Landing/AboutPanel";
import { ContactsPanel } from "@/components/Landing/ContactsPanel";
import { LandingNav, type LandingPanel } from "@/components/Landing/LandingNav";
import { AccountPreview, HistoryPreview, LoginPreview } from "@/components/Landing/PreviewCards";
import cards from "@/components/Landing/Landing.module.scss";
import { Button } from "@/ui/Button/Button";
import { Modal } from "@/ui/Modal/Modal";
import { Starfield } from "@/ui/Starfield/Starfield";
import styles from "./page.module.scss";

const PANELS: Record<LandingPanel, { title: string; description: string }> = {
  about: { title: "პროექტის შესახებ", description: "Billo — ინვოისები მარტივად" },
  contacts: { title: "კონტაქტები", description: "თამარ ხუსკივაძე — Billo-ს ავტორი" },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState<LandingPanel | null>(null);

  return (
    <div className={styles.landing}>
      <Starfield />
      <LandingNav onOpen={setPanel} />

      <section className={styles.hero}>
        <h1 className={styles.title}>თანამედროვე ფინანსური ასისტენტი</h1>
        <img className={styles.logo} src="/logo-symbol.svg" alt="" />
        <p className={styles.wordmark}>BILLO</p>
        <div className={styles.actions}>
          <Button variant="glass" size="lg" onClick={() => navigate("/login")}>
            შესვლა
          </Button>
          <Button variant="glass" size="lg" onClick={() => navigate("/register")}>
            რეგისტრაცია
          </Button>
        </div>
      </section>

      <LoginPreview />
      <AccountPreview className={cards.accountLeft} />
      <AccountPreview className={cards.accountRight} />
      <HistoryPreview />

      {panel && (
        <Modal
          title={PANELS[panel].title}
          description={PANELS[panel].description}
          icon={panel === "about" ? <img src="/logo-symbol.svg" alt="" width={28} height={28} /> : undefined}
          size={panel === "about" ? "lg" : "md"}
          backdrop="dim"
          onClose={() => setPanel(null)}
        >
          {panel === "about" ? <AboutPanel /> : <ContactsPanel />}
        </Modal>
      )}
    </div>
  );
}
