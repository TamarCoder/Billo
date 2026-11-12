import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AboutPanel } from "@/components/Landing/AboutPanel";
import { LandingNav, type LandingPanel } from "@/components/Landing/LandingNav";
import { AccountPreview, HistoryPreview, LoginPreview } from "@/components/Landing/PreviewCards";
import cards from "@/components/Landing/Landing.module.scss";
import { Button } from "@/ui/Button/Button";
import { Modal } from "@/ui/Modal/Modal";
import { Starfield } from "@/ui/Starfield/Starfield";
import styles from "./page.module.scss";

const PANELS: Record<LandingPanel, { title: string; text?: string[] }> = {
  about: { title: "პროექტის შესახებ" },
  contacts: { title: "კონტაქტები", text: ["ტექსტი მალე დაემატება."] },
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
          description={panel === "about" ? "Billo — ინვოისები მარტივად" : undefined}
          icon={panel === "about" ? <img src="/logo-symbol.svg" alt="" width={28} height={28} /> : undefined}
          size={panel === "about" ? "lg" : "md"}
          backdrop="dim"
          onClose={() => setPanel(null)}
        >
          {panel === "about" ? (
            <AboutPanel />
          ) : (
            PANELS[panel].text?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
        </Modal>
      )}
    </div>
  );
}
