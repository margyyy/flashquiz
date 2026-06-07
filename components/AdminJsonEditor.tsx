"use client";

import { UIEvent, useActionState, useRef, useState, type ReactNode } from "react";
import { Save } from "lucide-react";
import { saveSetJson, saveSubjectJson, type AdminActionState } from "@/app/actions";

type Props = {
  databaseReady: boolean;
  id: string;
  subjectId?: string;
  json: string;
  mode: "subject" | "set";
};

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

function highlightJson(json: string) {
  const tokenPattern =
    /("(?:\\.|[^"\\])*"(?=\s*:))|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false)\b|\bnull\b|([{}\[\]:,])/g;
  const pieces: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of json.matchAll(tokenPattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      pieces.push(json.slice(lastIndex, matchIndex));
    }

    const token = match[0];
    let className = "json-punctuation";
    if (match[1]) className = "json-key";
    if (match[2]) className = "json-string";
    if (match[3]) className = "json-number";
    if (match[4]) className = "json-boolean";
    if (token === "null") className = "json-null";

    pieces.push(
      <span key={`${token}-${tokenIndex}`} className={className}>
        {token}
      </span>,
    );
    tokenIndex += 1;
    lastIndex = matchIndex + token.length;
  }

  if (lastIndex < json.length) {
    pieces.push(json.slice(lastIndex));
  }

  return pieces;
}

export default function AdminJsonEditor({ databaseReady, id, subjectId, json, mode }: Props) {
  const action = mode === "set" ? saveSetJson : saveSubjectJson;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [value, setValue] = useState(json);
  const highlightedRef = useRef<HTMLPreElement>(null);
  const label = mode === "set" ? "set" : "subject";

  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (!highlightedRef.current) return;
    highlightedRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightedRef.current.scrollLeft = event.currentTarget.scrollLeft;
  }

  return (
    <form action={formAction} className="admin-json-form">
      <input type="hidden" name="id" value={id} />
      {subjectId && <input type="hidden" name="subjectId" value={subjectId} />}
      <div className={`admin-json-editor-shell ${mode === "subject" ? "subject" : ""}`}>
        <pre ref={highlightedRef} className="admin-json-highlight" aria-hidden="true">
          {highlightJson(value)}
          {"\n"}
        </pre>
        <textarea
          name="json"
          className="admin-json-editor"
          spellCheck={false}
          disabled={!databaseReady || pending}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onScroll={syncScroll}
        />
      </div>

      {state.message && (
        <div className={`admin-popup ${state.ok ? "success" : "error"}`} role="alert">
          {state.message}
        </div>
      )}

      <div className="admin-json-actions">
        <button disabled={!databaseReady || pending} className="primary-button">
          <Save className="h-4 w-4" />
          {pending ? "Salvataggio..." : `Salva ${label}`}
        </button>
      </div>
    </form>
  );
}
