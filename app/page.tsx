import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="hero-shell">
      <div className="hero-leaf hero-leaf-left" />
      <div className="hero-leaf hero-leaf-right" />
      <section className="hero-content">
        <p className="section-kicker">Plantasia</p>
        <h1>plantasia</h1>
        <p>
          Uno spazio essenziale per studiare materie, set, flashcard e quiz con
          una struttura ordinata e progressiva.
        </p>
        <Link href="/study" className="hero-button">
          Entra
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
