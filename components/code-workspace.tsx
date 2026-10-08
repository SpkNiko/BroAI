"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Play,
  Save,
  Undo2,
} from "lucide-react";

type FileItem = {
  path: string;
  language: string;
  content: string;
  savedContent: string;
};

const starterFiles: FileItem[] = [
  {
    path: "src/player.ts",
    language: "typescript",
    content: `export class Player {
  hp = 100;

  damage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
  }
}
`,
    savedContent: `export class Player {
  hp = 100;

  damage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
  }
}
`,
  },

  {
    path: "src/game.ts",
    language: "typescript",
    content: `import { Player } from "./player";

export const player = new Player();
`,
    savedContent: `import { Player } from "./player";

export const player = new Player();
`,
  },

  {
    path: "README.md",
    language: "markdown",
    content: `# BroAI Project

Twój projekt startowy.
`,
    savedContent: `# BroAI Project

Twój projekt startowy.
`,
  },
];

export function CodeWorkspace() {
  const [files, setFiles] =
    useState(starterFiles);

  const [activePath, setActivePath] =
    useState(
      starterFiles[0].path
    );

  const [log, setLog] =
    useState<string[]>([
      "BroAI workspace ready.",
    ]);

  const active = useMemo(
    () =>
      files.find(
        (file) =>
          file.path === activePath
      ) ?? files[0],
    [activePath, files]
  );

  const dirty =
    active.content !==
    active.savedContent;

  function updateContent(
    content: string
  ) {
    setFiles((current) =>
      current.map((file) =>
        file.path === activePath
          ? {
              ...file,
              content,
            }
          : file
      )
    );
  }

  function save() {
    setFiles((current) =>
      current.map((file) =>
        file.path === activePath
          ? {
              ...file,
              savedContent:
                file.content,
            }
          : file
      )
    );

    setLog((current) => [
      `Saved ${activePath}`,
      ...current,
    ]);
  }

  function run() {
    setLog((current) => [
      `RUN ${activePath}`,
      "No sandbox is connected yet — execution is intentionally disabled in this starter.",
      ...current,
    ]);
  }

  function rollback() {
    setFiles((current) =>
      current.map((file) =>
        file.path === activePath
          ? {
              ...file,
              content:
                file.savedContent,
            }
          : file
      )
    );

    setLog((current) => [
      `Reverted ${activePath}`,
      ...current,
    ]);
  }

  return (
    <div className="workspace">
      <aside className="file-tree">
        <div
          className="small muted"
          style={{
            padding:
              "4px 10px 10px",
          }}
        >
          FILES
        </div>

        {files.map((file) => (
          <button
            className={`file-item ${
              file.path === activePath
                ? "active"
                : ""
            }`}
            key={file.path}
            onClick={() =>
              setActivePath(
                file.path
              )
            }
          >
            {file.path}

            {file.content !==
              file.savedContent
              ? " *"
              : ""}
          </button>
        ))}
      </aside>

      <section className="editor-area">
        <div className="editor-head">
          <div className="row">
            <strong>
              {active.path}
            </strong>

            {dirty && (
              <span className="small muted">
                unsaved
              </span>
            )}
          </div>

          <div className="row">
            <button
              className="btn btn-ghost"
              onClick={rollback}
              disabled={!dirty}
            >
              <Undo2 size={15} />
              Cofnij
            </button>

            <button
              className="btn"
              onClick={run}
            >
              <Play size={15} />
              Run
            </button>

            <button
              className="btn btn-primary"
              onClick={save}
              disabled={!dirty}
            >
              <Save size={15} />
              Zapisz
            </button>
          </div>
        </div>

        <textarea
          className="code-editor"
          spellCheck={false}
          value={active.content}
          onChange={(event) =>
            updateContent(
              event.target.value
            )
          }
          aria-label="Code editor"
        />

        <div className="console">
          {log.map(
            (line, index) => (
              <div
                key={`${line}-${index}`}
              >
                $ {line}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
