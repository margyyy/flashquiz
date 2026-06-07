import { cookies } from "next/headers";
import { connection } from "next/server";
import { createSet, createSubject, deleteSet, deleteStudyItem, deleteSubject, unlockAdmin, updateSet, updateSubject } from "@/app/actions";
import AdminItemForm from "@/components/AdminItemForm";
import { getSubjects } from "@/lib/data";
import { hasDatabaseUrl } from "@/lib/prisma";
import { Database, KeyRound, Layers, LibraryBig, Plus, Save, Settings, Trash2 } from "lucide-react";

export const metadata = {
  title: "Admin - Plantasia",
  description: "Pannello amministrativo per materie, set e flashcard.",
};

type AdminPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await connection();
  const cookieStore = await cookies();
  const hasAdminAccess = cookieStore.get("plantasia_admin_access")?.value === "ok";
  const { error } = await searchParams;

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
            {error === "1" && <p className="admin-error">Codice non corretto.</p>}
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
  const sets = subjects.flatMap((subject) =>
    subject.sets.map((set) => ({ ...set, subjectName: subject.name })),
  );
  const setOptions = sets.map((set) => ({ id: set.id, name: set.name, subjectName: set.subjectName }));

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="page-title">Gestione contenuti</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-muted)]">
            <Database className="h-4 w-4" />
            {databaseReady ? "Database collegato" : "Modalita seed locale"}
          </div>
        </div>

        {!databaseReady && (
          <div className="mb-6 rounded-md border border-[var(--warning)] bg-[var(--warning-subtle)] p-4 text-sm text-[var(--text)]">
            Configura `DATABASE_URL` con la stringa Postgres di Supabase, poi esegui `npm run db:push` e `npm run db:seed` per abilitare la creazione dal pannello.
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="admin-panel">
            <div className="admin-panel-title">
              <LibraryBig className="h-4 w-4" />
              Materia
            </div>
            <form action={createSubject} className="admin-form">
              <input name="name" required placeholder="Nome materia" disabled={!databaseReady} />
              <input name="slug" placeholder="slug opzionale" disabled={!databaseReady} />
              <textarea name="description" placeholder="Descrizione" disabled={!databaseReady} />
              <button disabled={!databaseReady} className="primary-button">
                <Plus className="h-4 w-4" />
                Crea materia
              </button>
            </form>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title">
              <Layers className="h-4 w-4" />
              Set
            </div>
            <form action={createSet} className="admin-form">
              <select name="subjectId" required disabled={!databaseReady}>
                <option value="">Materia</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <input name="name" required placeholder="Nome set" disabled={!databaseReady} />
              <input name="slug" placeholder="slug opzionale" disabled={!databaseReady} />
              <textarea name="description" placeholder="Descrizione" disabled={!databaseReady} />
              <button disabled={!databaseReady} className="primary-button">
                <Plus className="h-4 w-4" />
                Crea set
              </button>
            </form>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title">
              <Settings className="h-4 w-4" />
              Item
            </div>
            <AdminItemForm databaseReady={databaseReady} sets={setOptions} />
          </section>
        </div>

        <section className="mt-8">
          <p className="section-kicker">Archivio</p>
          <div className="mt-3 grid gap-4">
            {subjects.map((subject) => (
              <details key={subject.id} className="admin-editor admin-subject-detail">
                <summary className="admin-level-summary">
                  <span>Materia</span>
                  <strong>{subject.name}</strong>
                  <em>
                    {subject.sets.length} set, {subject.sets.reduce((total, set) => total + set.items.length, 0)} item
                  </em>
                </summary>

                <div className="admin-detail-body">
                  <form action={updateSubject} className="admin-form admin-editor-main">
                    <input type="hidden" name="id" value={subject.id} />
                    <div className="admin-editor-grid">
                      <input name="name" required disabled={!databaseReady} defaultValue={subject.name} aria-label="Nome materia" />
                      <input name="slug" required disabled={!databaseReady} defaultValue={subject.slug} aria-label="Slug materia" />
                      <textarea name="description" disabled={!databaseReady} defaultValue={subject.description ?? ""} aria-label="Descrizione materia" />
                    </div>
                    <div className="admin-form-actions">
                      <button disabled={!databaseReady} className="primary-button">
                        <Save className="h-4 w-4" />
                        Salva materia
                      </button>
                    </div>
                  </form>

                  <form action={deleteSubject} className="admin-delete-form">
                    <input type="hidden" name="id" value={subject.id} />
                    <button disabled={!databaseReady} className="danger-button">
                      <Trash2 className="h-4 w-4" />
                      Elimina materia
                    </button>
                  </form>
                </div>

                <div className="admin-nested-list">
                  {subject.sets.map((set) => {
                    const flashcards = set.items.filter((item) => item.kind === "FLASHCARD");
                    const quizzes = set.items.filter((item) => item.kind !== "FLASHCARD");

                    return (
                      <details key={set.id} className="admin-nested-panel">
                        <summary className="admin-level-summary">
                          <span>Set</span>
                          <strong>{set.name}</strong>
                          <em>
                            {flashcards.length} flashcard, {quizzes.length} quiz
                          </em>
                        </summary>

                        <div className="admin-detail-body">
                          <form action={updateSet} className="admin-form">
                            <input type="hidden" name="id" value={set.id} />
                            <select name="subjectId" required disabled={!databaseReady} defaultValue={subject.id}>
                              {subjects.map((subjectOption) => (
                                <option key={subjectOption.id} value={subjectOption.id}>
                                  {subjectOption.name}
                                </option>
                              ))}
                            </select>
                            <input name="name" required disabled={!databaseReady} defaultValue={set.name} aria-label="Nome set" />
                            <input name="slug" required disabled={!databaseReady} defaultValue={set.slug} aria-label="Slug set" />
                            <textarea name="description" disabled={!databaseReady} defaultValue={set.description ?? ""} aria-label="Descrizione set" />
                            <div className="admin-form-actions">
                              <button disabled={!databaseReady} className="secondary-button">
                                <Save className="h-4 w-4" />
                                Salva set
                              </button>
                            </div>
                          </form>

                          <form action={deleteSet} className="admin-delete-form">
                            <input type="hidden" name="id" value={set.id} />
                            <button disabled={!databaseReady} className="danger-button">
                              <Trash2 className="h-4 w-4" />
                              Elimina set
                            </button>
                          </form>
                        </div>

                        <div className="admin-items-list">
                          <div className="admin-item-group">
                            <h3>Flashcard</h3>
                            {flashcards.length === 0 ? (
                              <p className="admin-empty">Nessuna flashcard in questo set.</p>
                            ) : (
                              flashcards.map((item) => (
                                <details key={item.id} className="admin-item-detail">
                                  <summary className="admin-level-summary">
                                    <span>Flashcard</span>
                                    <strong>{item.prompt}</strong>
                                    <em>Ordine {item.order + 1}</em>
                                  </summary>
                                  <div className="admin-detail-body">
                                    <AdminItemForm databaseReady={databaseReady} sets={setOptions} item={{ ...item, setId: set.id }} />
                                    <form action={deleteStudyItem} className="admin-delete-form">
                                      <input type="hidden" name="id" value={item.id} />
                                      <button disabled={!databaseReady} className="danger-button">
                                        <Trash2 className="h-4 w-4" />
                                        Elimina flashcard
                                      </button>
                                    </form>
                                  </div>
                                </details>
                              ))
                            )}
                          </div>

                          <div className="admin-item-group">
                            <h3>Quiz</h3>
                            {quizzes.length === 0 ? (
                              <p className="admin-empty">Nessun quiz in questo set.</p>
                            ) : (
                              quizzes.map((item) => (
                                <details key={item.id} className="admin-item-detail">
                                  <summary className="admin-level-summary">
                                    <span>{item.kind === "TRUE_FALSE" ? "Vero/Falso" : "Quiz"}</span>
                                    <strong>{item.prompt}</strong>
                                    <em>Ordine {item.order + 1}</em>
                                  </summary>
                                  <div className="admin-detail-body">
                                    <AdminItemForm databaseReady={databaseReady} sets={setOptions} item={{ ...item, setId: set.id }} />
                                    <form action={deleteStudyItem} className="admin-delete-form">
                                      <input type="hidden" name="id" value={item.id} />
                                      <button disabled={!databaseReady} className="danger-button">
                                        <Trash2 className="h-4 w-4" />
                                        Elimina quiz
                                      </button>
                                    </form>
                                  </div>
                                </details>
                              ))
                            )}
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
