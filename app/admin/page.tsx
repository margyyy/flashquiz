import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import {
  createSet,
  createSubject,
  deleteSet,
  deleteSubject,
  unlockAdmin,
} from "@/app/actions";
import AdminJsonEditor from "@/components/AdminJsonEditor";
import { getSubjects } from "@/lib/data";
import { hasDatabaseUrl } from "@/lib/prisma";
import type { CardSet, Subject } from "@/lib/types";
import { Database, FileJson, FolderPlus, KeyRound, Layers, LibraryBig, Plus, Trash2 } from "lucide-react";

export const metadata = {
  title: "Admin - Plantasia",
  description: "Pannello amministrativo per materie, set, flashcard e quiz.",
};

type AdminPageProps = {
  searchParams: Promise<{ subject?: string; set?: string; error?: string }>;
};

function subjectJson(subject: Subject) {
  return JSON.stringify(
    {
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      description: subject.description,
    },
    null,
    2,
  );
}

function setJson(subject: Subject, set: CardSet) {
  return JSON.stringify(
    {
      id: set.id,
      subjectId: subject.id,
      name: set.name,
      slug: set.slug,
      description: set.description,
      items: set.items.map((item) => ({
        id: item.id,
        kind: item.kind,
        prompt: item.prompt,
        answer: item.answer,
        options: item.options,
        correctOptionIndexes: item.correctOptionIndexes,
        allowMultiple: item.allowMultiple,
        explanation: item.explanation,
      })),
    },
    null,
    2,
  );
}

function itemCounts(set: CardSet) {
  const flashcards = set.items.filter((item) => item.kind === "FLASHCARD").length;
  const quizzes = set.items.length - flashcards;
  return `${flashcards} flashcard, ${quizzes} quiz`;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await connection();
  const cookieStore = await cookies();
  const hasAdminAccess = cookieStore.get("plantasia_admin_access")?.value === "ok";
  const params = await searchParams;

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-[var(--bg)] px-4 py-8">
        <section className="admin-login-panel">
          <div className="admin-panel-title">
            <KeyRound className="h-4 w-4" />
            Accesso admin
          </div>
          <form action={unlockAdmin} className="admin-form">
            <input name="code" type="password" required placeholder="Codice admin" autoComplete="off" />
            {params.error === "1" && <p className="admin-error">Codice non corretto.</p>}
            <button className="primary-button">
              <KeyRound className="h-4 w-4" />
              Entra
            </button>
          </form>
        </section>
      </div>
    );
  }

  const subjects = await getSubjects();
  const databaseReady = hasDatabaseUrl();
  const selectedSubject = subjects.find((subject) => subject.id === params.subject) ?? subjects[0] ?? null;
  const selectedSet =
    selectedSubject?.sets.find((set) => set.id === params.set) ??
    subjects.flatMap((subject) => subject.sets).find((set) => set.id === params.set) ??
    null;
  const selectedSetSubject = selectedSet
    ? subjects.find((subject) => subject.sets.some((set) => set.id === selectedSet.id)) ?? selectedSubject
    : selectedSubject;
  const editorMode = selectedSet ? "set" : selectedSubject ? "subject" : "empty";

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="page-title">Editor JSON</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-muted)]">
            <Database className="h-4 w-4" />
            {databaseReady ? "Database collegato" : "Modalita seed locale"}
          </div>
        </div>

        {!databaseReady && (
          <div className="mb-6 rounded-md border border-[var(--warning)] bg-[var(--warning-subtle)] p-4 text-sm text-[var(--text)]">
            Configura `DATABASE_URL`, poi esegui `npm run db:push` e `npm run db:seed` per salvare dal pannello.
          </div>
        )}

        <div className="admin-workbench">
          <aside className="admin-sidebar">
            <details className="admin-panel admin-add-panel">
              <summary className="admin-add-summary">
                <FolderPlus className="h-4 w-4" />
                Aggiungi
              </summary>
              <div className="admin-add-body">
                <form action={createSubject} className="admin-form">
                  <input name="name" required placeholder="Nuova subject" disabled={!databaseReady} />
                  <input name="slug" placeholder="slug opzionale" disabled={!databaseReady} />
                  <textarea name="description" placeholder="Descrizione subject" disabled={!databaseReady} />
                  <button disabled={!databaseReady} className="primary-button">
                    <Plus className="h-4 w-4" />
                    Subject
                  </button>
                </form>

                <form action={createSet} className="admin-form admin-inline-create">
                  <select name="subjectId" required disabled={!databaseReady} defaultValue={selectedSubject?.id ?? ""}>
                    <option value="">Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  <input name="name" required placeholder="Nuovo set" disabled={!databaseReady} />
                  <input name="slug" placeholder="slug opzionale" disabled={!databaseReady} />
                  <textarea name="description" placeholder="Descrizione set" disabled={!databaseReady} />
                  <button disabled={!databaseReady} className="secondary-button">
                    <Plus className="h-4 w-4" />
                    Set
                  </button>
                </form>
              </div>
            </details>

            <section className="admin-panel admin-tree-panel">
              <div className="admin-panel-title">
                <LibraryBig className="h-4 w-4" />
                Subject
              </div>
              <div className="admin-tree">
                {subjects.length === 0 ? (
                  <p className="admin-empty">Nessuna subject.</p>
                ) : (
                  subjects.map((subject) => {
                    const isActiveSubject = selectedSubject?.id === subject.id && !selectedSet;
                    const isOpenSubject = selectedSubject?.id === subject.id || subject.sets.some((set) => set.id === selectedSet?.id);

                    return (
                      <div key={subject.id} className="admin-tree-subject">
                        <Link
                          href={`/admin?subject=${subject.id}`}
                          className={`admin-tree-link ${isActiveSubject ? "active" : ""}`}
                        >
                          <LibraryBig className="h-4 w-4" />
                          <span>{subject.name}</span>
                          <em>{subject.sets.length}</em>
                        </Link>

                        {isOpenSubject && (
                          <div className="admin-set-tree">
                            {subject.sets.length === 0 ? (
                              <p className="admin-empty compact">Nessun set.</p>
                            ) : (
                              subject.sets.map((set) => (
                                <Link
                                  key={set.id}
                                  href={`/admin?subject=${subject.id}&set=${set.id}`}
                                  className={`admin-tree-link set ${selectedSet?.id === set.id ? "active" : ""}`}
                                >
                                  <Layers className="h-4 w-4" />
                                  <span>{set.name}</span>
                                  <em>{set.items.length}</em>
                                </Link>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </aside>

          <main className="admin-json-box">
            <div className="admin-json-head">
              <div>
                <div className="admin-panel-title">
                  <FileJson className="h-4 w-4" />
                  {editorMode === "set" ? "JSON set" : editorMode === "subject" ? "JSON subject" : "JSON"}
                </div>
                <p>
                  {selectedSet && selectedSetSubject
                    ? `${selectedSetSubject.name} / ${selectedSet.name} - ${itemCounts(selectedSet)}`
                    : selectedSubject
                      ? `${selectedSubject.name} - ${selectedSubject.sets.length} set`
                      : "Crea una subject per iniziare."}
                </p>
              </div>
            </div>

            {selectedSet && selectedSetSubject ? (
              <>
                <AdminJsonEditor
                  key={selectedSet.id}
                  databaseReady={databaseReady}
                  id={selectedSet.id}
                  subjectId={selectedSetSubject.id}
                  json={setJson(selectedSetSubject, selectedSet)}
                  mode="set"
                />
                <form action={deleteSet} className="admin-json-delete">
                  <input type="hidden" name="id" value={selectedSet.id} />
                  <button disabled={!databaseReady} className="danger-button">
                    <Trash2 className="h-4 w-4" />
                    Elimina set
                  </button>
                </form>
              </>
            ) : selectedSubject ? (
              <>
                <AdminJsonEditor
                  key={selectedSubject.id}
                  databaseReady={databaseReady}
                  id={selectedSubject.id}
                  json={subjectJson(selectedSubject)}
                  mode="subject"
                />
                <form action={deleteSubject} className="admin-json-delete">
                  <input type="hidden" name="id" value={selectedSubject.id} />
                  <button disabled={!databaseReady} className="danger-button">
                    <Trash2 className="h-4 w-4" />
                    Elimina subject
                  </button>
                </form>
              </>
            ) : (
              <div className="admin-json-empty">
                <FileJson className="h-8 w-8" />
                <p>Nessun contenuto selezionato.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
