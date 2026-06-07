import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubject } from "@/lib/data";
import { ArrowLeft, ArrowRight, BookOpen, ListChecks } from "lucide-react";

export default async function SubjectPage({ params }: PageProps<"/study/[subjectSlug]">) {
  const { subjectSlug } = await params;
  const subject = await getSubject(subjectSlug);

  if (!subject) notFound();

  return (
    <div className="page-shell">
      <Link href="/study" className="back-link">
        <ArrowLeft className="h-4 w-4" />
        Materie
      </Link>

      <div className="page-header">
        <p className="section-kicker">Materia</p>
        <h1 className="page-title">{subject.name}</h1>
        <p className="page-subtitle">{subject.description}</p>
      </div>

      <div className="set-list">
        {subject.sets.map((set) => {
          const quizCount = set.items.filter((item) => item.kind !== "FLASHCARD").length;
          const flashcardCount = set.items.length - quizCount;
          const href = quizCount > 0 && flashcardCount === 0 ? `/quiz/${set.id}` : `/flashcard/${set.id}`;

          return (
            <Link key={set.id} href={href} className="set-row">
              <div className="set-row-icon">
                {quizCount > 0 && flashcardCount === 0 ? <ListChecks className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <h2>{set.name}</h2>
                <p>
                  {flashcardCount} flashcard
                  {quizCount > 0 ? `, ${quizCount} quiz` : ""}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
