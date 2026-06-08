export interface PreviewFile {
  path: string;
  content: string;
}

interface PreviewSession {
  files: Map<string, string>;
  createdAt: number;
}

const store = new Map<string, PreviewSession>();

const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

function cleanup() {
  const now = Date.now();
  for (const [id, session] of store) {
    if (now - session.createdAt > SESSION_TTL) store.delete(id);
  }
}

export function createSession(files: PreviewFile[]): string {
  cleanup();
  const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const map = new Map<string, string>();
  for (const f of files) {
    const normalized = f.path.replace(/\\/g, "/").replace(/^\.?\//, "");
    map.set(normalized, f.content);
  }
  store.set(id, { files: map, createdAt: Date.now() });
  return id;
}

export function getFile(id: string, filePath: string): string | null {
  const session = store.get(id);
  if (!session) return null;
  const normalized = filePath.replace(/\\/g, "/").replace(/^\.?\//, "");
  return session.files.get(normalized) ?? null;
}
