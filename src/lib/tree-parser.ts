export interface TreeNode {
  name: string;
  isDirectory: boolean;
  children: TreeNode[];
  depth: number;
  path: string;
}

export interface TreeStats {
  totalFiles: number;
  totalFolders: number;
  maxDepth: number;
  extensions: Record<string, number>;
  totalSize: string | null;
  volumes: string[];
}

/**
 * Parse `tree` command output into a structured tree.
 * Handles both backslash-escaped spaces and Unicode box-drawing chars.
 */
export function parseSummary(input: string): { totalSize: string | null; volumes: string[] } {
  let totalSize: string | null = null;
  const volumes: string[] = [];

  // Look for summary section
  const summaryIdx = input.indexOf("===== Summary");
  if (summaryIdx !== -1) {
    const summaryBlock = input.slice(summaryIdx);
    const sizeMatch = summaryBlock.match(/Total\s+size\s*:\s*(.+)/i);
    if (sizeMatch) totalSize = sizeMatch[1].trim();

    // Extract volumes between "Volumes:" and first stat line
    const volMatch = summaryBlock.match(/Volumes:\s*\n([\s\S]*?)(?=Directories|Files|Total|$)/i);
    if (volMatch) {
      volMatch[1].split("\n").forEach((line) => {
        const v = line.trim();
        if (v) volumes.push(v);
      });
    }
  }

  return { totalSize, volumes };
}

export function parseTreeOutput(input: string): TreeNode[] {
  // Strip summary section before parsing tree
  const summaryIdx = input.indexOf("===== Summary");
  const treeInput = summaryIdx !== -1 ? input.slice(0, summaryIdx) : input;
  const lines = treeInput.split("\n").filter((l) => l.trim().length > 0);
  const roots: TreeNode[] = [];
  const stack: { node: TreeNode; indent: number }[] = [];

  for (const rawLine of lines) {
    // Remove tree-drawing characters: │ ├ └ ─ ` |
    const cleaned = rawLine
      .replace(/[\u2502\u2514\u251C\u2500]/g, " ")   // Unicode box chars
      .replace(/[|`]/g, " ")                          // ASCII tree chars
      .replace(/--/g, " ")                            // ASCII connector
      .replace(/\\ /g, "\u0000")                      // preserve escaped spaces
      .trimEnd();

    // Calculate indent level from leading whitespace
    const stripped = cleaned.trimStart();
    if (!stripped) continue;

    const indent = cleaned.length - stripped.length;
    const name = stripped.replace(/\u0000/g, " ").replace(/\/$/,"");

    if (!name) continue;

    const isDirectory = rawLine.trimEnd().endsWith("/") ||
      !looksLikeFile(name);

    const node: TreeNode = {
      name,
      isDirectory,
      children: [],
      depth: 0,
      path: name,
    };

    // Pop stack until we find a parent with smaller indent
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    if (stack.length === 0) {
      node.depth = 0;
      node.path = name;
      roots.push(node);
    } else {
      const parent = stack[stack.length - 1].node;
      node.depth = parent.depth + 1;
      node.path = parent.path + "/" + name;
      parent.isDirectory = true; // has children → must be a directory
      parent.children.push(node);
    }

    stack.push({ node, indent });
  }

  return roots;
}

/**
 * Determine if a name looks like a file (has a plausible extension).
 * Falls back to false (treated as directory) for ambiguous names.
 */
function looksLikeFile(name: string): boolean {
  // Names starting with [ are typically folder labels like [SubGroup]
  if (name.startsWith("[")) return false;
  // Match a file extension: 1-10 alphanumeric chars after the last dot
  const match = name.match(/\.([a-zA-Z0-9]{1,10})$/);
  if (!match) return false;
  // Common extensions that confirm it's a file
  const ext = match[1].toLowerCase();
  const fileExts = new Set([
    // video
    "mkv","mp4","avi","mov","wmv","flv","webm","m4v","ts","mpg","mpeg",
    // audio
    "mp3","flac","wav","aac","ogg","wma","m4a",
    // images
    "jpg","jpeg","png","gif","webp","svg","ico","bmp","tiff",
    // archives
    "zip","rar","7z","tar","gz","bz2","xz","zst",
    // code
    "js","jsx","ts","tsx","py","rs","go","java","c","cpp","h","rb","php","swift","kt","cs","lua","sh","bash","zsh","fish","ps1","bat","cmd",
    // web
    "html","htm","css","scss","sass","less",
    // documents
    "md","txt","pdf","doc","docx","xls","xlsx","ppt","pptx","csv","rtf",
    // config
    "json","yaml","yml","toml","xml","ini","cfg","conf","cnf","env","properties",
    // data / db
    "db","sql","sqlite","tvdb","dat","log",
    // certificates
    "crt","csr","key","p12","pem","cer","pfx",
    // apps / packages
    "ipa","apk","dmg","exe","msi","deb","rpm","jar","war","appimage",
    // subtitles
    "srt","ass","sub","ssa","vtt",
    // misc
    "url","lnk","desktop","iso","img","torrent","nfo",
  ]);
  return fileExts.has(ext);
}

export function getExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
}

export function computeStats(roots: TreeNode[]): TreeStats {
  const stats: TreeStats = {
    totalFiles: 0,
    totalFolders: 0,
    maxDepth: 0,
    extensions: {},
    totalSize: null,
    volumes: [],
  };

  function walk(node: TreeNode) {
    if (node.isDirectory) {
      stats.totalFolders++;
    } else {
      stats.totalFiles++;
      const ext = getExtension(node.name);
      if (ext) {
        stats.extensions[ext] = (stats.extensions[ext] || 0) + 1;
      }
    }
    if (node.depth > stats.maxDepth) stats.maxDepth = node.depth;
    node.children.forEach(walk);
  }

  roots.forEach(walk);
  return stats;
}

export function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return nodes;
  const q = query.toLowerCase();

  function matches(node: TreeNode): TreeNode | null {
    const nameMatch = node.name.toLowerCase().includes(q);

    const filteredChildren = node.children
      .map(matches)
      .filter(Boolean) as TreeNode[];

    if (nameMatch || filteredChildren.length > 0) {
      return {
        ...node,
        children: nameMatch ? node.children : filteredChildren,
      };
    }
    return null;
  }

  return nodes.map(matches).filter(Boolean) as TreeNode[];
}

export function countDescendants(node: TreeNode): { files: number; folders: number } {
  let files = 0;
  let folders = 0;
  function walk(n: TreeNode) {
    if (n.isDirectory) folders++;
    else files++;
    n.children.forEach(walk);
  }
  node.children.forEach(walk);
  return { files, folders };
}
