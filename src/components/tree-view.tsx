"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Chip } from "@heroui/react";
import { TreeNode, countDescendants } from "@/lib/tree-parser";
import { getFileIcon } from "@/lib/file-icons";

interface TreeNodeRowProps {
  node: TreeNode;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  searchQuery: string;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-warning/30 text-warning-600 dark:text-warning-400 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

function TreeNodeRow({ node, expandedPaths, toggleExpand, searchQuery }: TreeNodeRowProps) {
  const isOpen = expandedPaths.has(node.path);
  const hasChildren = node.children.length > 0;
  const iconInfo = getFileIcon(node.name, node.isDirectory, isOpen);
  const descendants = useMemo(
    () => (node.isDirectory ? countDescendants(node) : null),
    [node]
  );

  return (
    <div>
      <div
        className="tree-row flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none group"
        style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
        onClick={() => hasChildren && toggleExpand(node.path)}
        role={hasChildren ? "button" : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onKeyDown={(e) => {
          if (hasChildren && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            toggleExpand(node.path);
          }
        }}
      >
        {/* Expand/collapse chevron */}
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {hasChildren ? (
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <Icon
                icon="solar:alt-arrow-right-bold"
                width={14}
                className="text-default-500"
              />
            </motion.span>
          ) : (
            <span className="w-3.5" />
          )}
        </span>

        {/* File/folder icon */}
        <Icon icon={iconInfo.icon} width={18} style={{ color: iconInfo.color }} className="flex-shrink-0" />

        {/* Name */}
        <span className={`text-sm truncate ${node.isDirectory ? "font-medium" : "text-default-700 dark:text-default-500"}`}>
          {highlightMatch(node.name, searchQuery)}
        </span>

        {/* Badge for directories */}
        {node.isDirectory && descendants && (
          <span className="ml-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {descendants.folders > 0 && (
              <Chip size="sm" variant="flat" color="warning" className="h-5 text-[10px]">
                {descendants.folders} folder{descendants.folders !== 1 ? "s" : ""}
              </Chip>
            )}
            {descendants.files > 0 && (
              <Chip size="sm" variant="flat" color="primary" className="h-5 text-[10px]">
                {descendants.files} file{descendants.files !== 1 ? "s" : ""}
              </Chip>
            )}
          </span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative">
              {/* Vertical connector line */}
              <div
                className="absolute top-0 bottom-0 border-l border-default-200 dark:border-default-100"
                style={{ left: `${node.depth * 20 + 20}px` }}
              />
              {node.children.map((child) => (
                <TreeNodeRow
                  key={child.path}
                  node={child}
                  expandedPaths={expandedPaths}
                  toggleExpand={toggleExpand}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TreeViewProps {
  roots: TreeNode[];
  searchQuery: string;
}

export function TreeView({ roots, searchQuery }: TreeViewProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    // Auto-expand root nodes
    const initial = new Set<string>();
    roots.forEach((r) => initial.add(r.path));
    return initial;
  });

  const toggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const all = new Set<string>();
    function walk(node: TreeNode) {
      if (node.isDirectory) all.add(node.path);
      node.children.forEach(walk);
    }
    roots.forEach(walk);
    setExpandedPaths(all);
  }, [roots]);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set());
  }, []);

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-2 mb-3 px-2">
        <button
          onClick={expandAll}
          className="text-xs text-primary hover:text-primary-600 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
        >
          <Icon icon="solar:maximize-square-bold" width={14} />
          Expand all
        </button>
        <span className="text-default-300">|</span>
        <button
          onClick={collapseAll}
          className="text-xs text-primary hover:text-primary-600 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
        >
          <Icon icon="solar:minimize-square-bold" width={14} />
          Collapse all
        </button>
      </div>

      {/* Tree */}
      <div className="font-mono text-[13px]">
        {roots.map((root) => (
          <TreeNodeRow
            key={root.path}
            node={root}
            expandedPaths={expandedPaths}
            toggleExpand={toggleExpand}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}
