const extensionIcons: Record<string, { icon: string; color: string }> = {
  // Video
  mkv: { icon: "solar:video-frame-bold-duotone", color: "#e879f9" },
  mp4: { icon: "solar:video-frame-bold-duotone", color: "#e879f9" },
  avi: { icon: "solar:video-frame-bold-duotone", color: "#e879f9" },
  mov: { icon: "solar:video-frame-bold-duotone", color: "#e879f9" },
  wmv: { icon: "solar:video-frame-bold-duotone", color: "#e879f9" },
  flv: { icon: "solar:video-frame-bold-duotone", color: "#e879f9" },
  webm: { icon: "solar:video-frame-bold-duotone", color: "#e879f9" },

  // Audio
  mp3: { icon: "solar:music-note-2-bold-duotone", color: "#fb923c" },
  flac: { icon: "solar:music-note-2-bold-duotone", color: "#fb923c" },
  wav: { icon: "solar:music-note-2-bold-duotone", color: "#fb923c" },
  aac: { icon: "solar:music-note-2-bold-duotone", color: "#fb923c" },

  // Images
  jpg: { icon: "solar:gallery-bold-duotone", color: "#4ade80" },
  jpeg: { icon: "solar:gallery-bold-duotone", color: "#4ade80" },
  png: { icon: "solar:gallery-bold-duotone", color: "#4ade80" },
  gif: { icon: "solar:gallery-bold-duotone", color: "#38bdf8" },
  webp: { icon: "solar:gallery-bold-duotone", color: "#4ade80" },
  svg: { icon: "solar:gallery-bold-duotone", color: "#facc15" },
  ico: { icon: "solar:gallery-bold-duotone", color: "#4ade80" },

  // Archives
  zip: { icon: "solar:zip-file-bold-duotone", color: "#fbbf24" },
  rar: { icon: "solar:zip-file-bold-duotone", color: "#fbbf24" },
  "7z": { icon: "solar:zip-file-bold-duotone", color: "#fbbf24" },
  tar: { icon: "solar:zip-file-bold-duotone", color: "#fbbf24" },
  gz: { icon: "solar:zip-file-bold-duotone", color: "#fbbf24" },

  // Code
  ts: { icon: "solar:code-bold-duotone", color: "#3b82f6" },
  tsx: { icon: "solar:code-bold-duotone", color: "#3b82f6" },
  js: { icon: "solar:code-bold-duotone", color: "#facc15" },
  jsx: { icon: "solar:code-bold-duotone", color: "#facc15" },
  py: { icon: "solar:code-bold-duotone", color: "#3b82f6" },
  rs: { icon: "solar:code-bold-duotone", color: "#f97316" },
  go: { icon: "solar:code-bold-duotone", color: "#38bdf8" },
  java: { icon: "solar:code-bold-duotone", color: "#ef4444" },
  html: { icon: "solar:code-bold-duotone", color: "#f97316" },
  css: { icon: "solar:code-bold-duotone", color: "#3b82f6" },

  // Documents
  md: { icon: "solar:document-text-bold-duotone", color: "#94a3b8" },
  txt: { icon: "solar:document-text-bold-duotone", color: "#94a3b8" },
  pdf: { icon: "solar:document-text-bold-duotone", color: "#ef4444" },
  doc: { icon: "solar:document-text-bold-duotone", color: "#3b82f6" },
  docx: { icon: "solar:document-text-bold-duotone", color: "#3b82f6" },

  // Config
  json: { icon: "solar:settings-bold-duotone", color: "#facc15" },
  yaml: { icon: "solar:settings-bold-duotone", color: "#ef4444" },
  yml: { icon: "solar:settings-bold-duotone", color: "#ef4444" },
  toml: { icon: "solar:settings-bold-duotone", color: "#94a3b8" },
  xml: { icon: "solar:settings-bold-duotone", color: "#f97316" },
  ini: { icon: "solar:settings-bold-duotone", color: "#94a3b8" },
  cnf: { icon: "solar:settings-bold-duotone", color: "#94a3b8" },

  // Certificates & Keys
  crt: { icon: "solar:shield-keyhole-bold-duotone", color: "#22d3ee" },
  csr: { icon: "solar:shield-keyhole-bold-duotone", color: "#22d3ee" },
  key: { icon: "solar:key-bold-duotone", color: "#fbbf24" },
  p12: { icon: "solar:shield-keyhole-bold-duotone", color: "#22d3ee" },
  pem: { icon: "solar:shield-keyhole-bold-duotone", color: "#22d3ee" },

  // Apps
  ipa: { icon: "solar:box-bold-duotone", color: "#a78bfa" },
  apk: { icon: "solar:box-bold-duotone", color: "#4ade80" },
  dmg: { icon: "solar:box-bold-duotone", color: "#94a3b8" },
  exe: { icon: "solar:box-bold-duotone", color: "#60a5fa" },
  jar: { icon: "solar:box-bold-duotone", color: "#f97316" },
  msi: { icon: "solar:box-bold-duotone", color: "#60a5fa" },

  // Subtitles
  srt: { icon: "solar:subtitles-bold-duotone", color: "#fca5a5" },
  ass: { icon: "solar:subtitles-bold-duotone", color: "#fca5a5" },
  sub: { icon: "solar:subtitles-bold-duotone", color: "#fca5a5" },

  // Database
  db: { icon: "solar:database-bold-duotone", color: "#a78bfa" },
  sql: { icon: "solar:database-bold-duotone", color: "#f97316" },
  tvdb: { icon: "solar:database-bold-duotone", color: "#a78bfa" },
  dat: { icon: "solar:database-bold-duotone", color: "#94a3b8" },

  // Web
  url: { icon: "solar:link-bold-duotone", color: "#38bdf8" },
};

const defaultFileIcon = { icon: "solar:file-bold-duotone", color: "#94a3b8" };
const folderIcon = { icon: "solar:folder-bold-duotone", color: "#fbbf24" };
const folderOpenIcon = { icon: "solar:folder-open-bold-duotone", color: "#fbbf24" };

export function getFileIcon(filename: string, isDirectory: boolean, isOpen?: boolean) {
  if (isDirectory) return isOpen ? folderOpenIcon : folderIcon;
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return extensionIcons[ext] || defaultFileIcon;
}
