"use client";

import { useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { createStudyItem, updateStudyItem } from "@/app/actions";
import type { StudyItem, StudyItemKind } from "@/lib/types";

type SetOption = {
  id: string;
  name: string;
  subjectName: string;
};

type Props = {
  databaseReady: boolean;
  sets: SetOption[];
  item?: StudyItem & { setId: string };
};

export default function AdminItemForm({ databaseReady, sets, item }: Props) {
  const initialKind = item?.kind ?? "FLASHCARD";
  const [kind, setKind] = useState<StudyItemKind>(initialKind);
  const [optionCount, setOptionCount] = useState(Math.max(2, item?.options?.length ?? 2));
  const [allowMultiple, setAllowMultiple] = useState(Boolean(item?.allowMultiple));

  const optionIndexes = useMemo(
    () => Array.from({ length: optionCount }, (_, index) => index),
    [optionCount],
  );
  const isFlashcard = kind === "FLASHCARD";
  const isMultipleChoice = kind === "MULTIPLE_CHOICE";
  const isTrueFalse = kind === "TRUE_FALSE";
  const action = item ? updateStudyItem : createStudyItem;

  return (
    <form action={action} className="admin-form">
      {item && <input type="hidden" name="id" value={item.id} />}
      <select name="setId" required disabled={!databaseReady} defaultValue={item?.setId ?? ""}>
        <option value="">Set</option>
        {sets.map((set) => (
          <option key={set.id} value={set.id}>
            {set.subjectName} / {set.name}
          </option>
        ))}
      </select>
      <select
        name="kind"
        required
        disabled={!databaseReady}
        value={kind}
        onChange={(event) => setKind(event.target.value as StudyItemKind)}
      >
        <option value="FLASHCARD">Flashcard</option>
        <option value="MULTIPLE_CHOICE">Quiz - risposta multipla</option>
        <option value="TRUE_FALSE">Quiz - vero o falso</option>
      </select>

      {isFlashcard && (
        <>
          <textarea name="prompt" required placeholder="Fronte" disabled={!databaseReady} defaultValue={item?.prompt ?? ""} />
          <textarea name="answer" required placeholder="Retro" disabled={!databaseReady} defaultValue={item?.answer ?? ""} />
        </>
      )}

      {!isFlashcard && (
        <>
          <textarea name="prompt" required placeholder="Titolo o domanda del quiz" disabled={!databaseReady} defaultValue={item?.prompt ?? ""} />

          {isMultipleChoice && (
            <div className="admin-choice-box">
              <div className="admin-choice-head">
                <span>Risposte</span>
                <button
                  type="button"
                  className="secondary-button compact-button"
                  disabled={!databaseReady || optionCount >= 5}
                  onClick={() => setOptionCount((value) => Math.min(5, value + 1))}
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi risposta
                </button>
              </div>
              {optionIndexes.map((index) => (
                <label key={index} className="answer-option-row">
                  <input
                    type={allowMultiple ? "checkbox" : "radio"}
                    name="correctOptionIndexes"
                    value={index}
                    defaultChecked={item?.correctOptionIndexes.includes(index)}
                    disabled={!databaseReady}
                  />
                  <input
                    name="options"
                    required={index < 2}
                    placeholder={`Risposta ${index + 1}`}
                    disabled={!databaseReady}
                    defaultValue={item?.options?.[index] ?? ""}
                  />
                </label>
              ))}
              <label className="admin-check">
                <input
                  name="allowMultiple"
                  type="checkbox"
                  checked={allowMultiple}
                  disabled={!databaseReady}
                  onChange={(event) => setAllowMultiple(event.target.checked)}
                />
                Piu risposte corrette
              </label>
            </div>
          )}

          {isTrueFalse && (
            <div className="true-false-grid">
              <label className="answer-option-row">
                <input
                  type="radio"
                  name="correctOptionIndexes"
                  value="0"
                  defaultChecked={(item?.correctOptionIndexes[0] ?? 0) === 0}
                  disabled={!databaseReady}
                />
                <span>Vero</span>
              </label>
              <label className="answer-option-row">
                <input
                  type="radio"
                  name="correctOptionIndexes"
                  value="1"
                  defaultChecked={item?.correctOptionIndexes[0] === 1}
                  disabled={!databaseReady}
                />
                <span>Falso</span>
              </label>
            </div>
          )}

          <textarea name="explanation" placeholder="Spiegazione opzionale" disabled={!databaseReady} defaultValue={item?.explanation ?? ""} />
        </>
      )}

      {item && <input name="order" type="number" placeholder="Ordine" disabled={!databaseReady} defaultValue={item.order} />}
      <button disabled={!databaseReady} className="primary-button">
        {item ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {item ? "Salva item" : "Crea item"}
      </button>
    </form>
  );
}
