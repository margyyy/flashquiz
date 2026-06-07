import Link from "next/link";
import { connection } from "next/server";
import { getSubjects } from "@/lib/data";
import { ArrowRight, Layers } from "lucide-react";

export const metadata = {
  title: "Studio - Plantasia",
};

export default async function StudyPage() {
  await connection();
  const subjects = await getSubjects();

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="section-kicker">Studio</p>
        <h1 className="page-title">Materie</h1>
        <p className="page-subtitle">Scegli una materia, poi entra in un set di flashcard o quiz.</p>
      </div>

      <div className="subject-grid">
        {subjects.map((subject) => {
          const itemCount = subject.sets.reduce((total, set) => total + set.items.length, 0);
          return (
            <Link key={subject.id} href={`/study/${subject.slug}`} className="subject-card">
              <div>
                <div className="subject-icon">
                  <Layers className="h-5 w-5" />
                </div>
                <h2>{subject.name}</h2>
                <p>{subject.description}</p>
              </div>
              <div className="subject-meta">
                <span>{subject.sets.length} set</span>
                <span>{itemCount} item</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
