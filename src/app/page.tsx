"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardBody, Input, Button, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { parseTreeOutput, parseSummary, computeStats, filterTree, type TreeNode } from "@/lib/tree-parser";
import { TreeView } from "@/components/tree-view";
import { StatsCards, SummaryBar } from "@/components/stats-bar";

const SAMPLE_TREE = `/var/lib/libvirt/
├── boot
├── dnsmasq
│   ├── default.addnhosts
│   ├── default.conf
│   ├── default.hostsfile
│   ├── virbr0.macs
│   └── virbr0.status
├── images
│   ├── virtio-win-0.1.271.iso
│   ├── vm02.qcow2
│   ├── vm03.qcow2
│   ├── vm04.qcow2
│   ├── vm05.qcow2
│   └── vm06.qcow2
├── qemu
│   ├── checkpoint
│   ├── domain-11-vm02
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-12-vm04
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-16-vm06
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-17-vm01
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-1-vm02
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-1-vm03
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-1-vm04
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-2-vm02
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-2-vm04
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-3-vm02
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-3-vm03
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-4-vm02
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-4-vm03
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-75-vm06
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-77-vm07
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-79-vm09
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-87-vm05
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── domain-88-vm08
│   │   ├── master-key.aes
│   │   └── monitor.sock
│   ├── dump
│   ├── nvram
│   ├── qmp-0BO8D3
│   ├── qmp-AK1XI3
│   ├── qmp-O7IOM3
│   │   ├── qmp.monitor
│   │   └── qmp.pid
│   ├── ram
│   ├── save
│   └── snapshot
└── sanlock
`;

export default function HomePage() {
  const [inputText, setInputText] = useState("");
  const [treeRoots, setTreeRoots] = useState<TreeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasVisualized, setHasVisualized] = useState(false);

  const handleVisualize = useCallback(() => {
    if (!inputText.trim()) return;
    const parsed = parseTreeOutput(inputText);
    setTreeRoots(parsed);
    setHasVisualized(true);
    setSearchQuery("");
  }, [inputText]);

  const handleLoadSample = useCallback(() => {
    setInputText(SAMPLE_TREE);
  }, []);

  const handleClear = useCallback(() => {
    setInputText("");
    setTreeRoots([]);
    setHasVisualized(false);
    setSearchQuery("");
  }, []);

  const filteredRoots = useMemo(
    () => filterTree(treeRoots, searchQuery),
    [treeRoots, searchQuery]
  );

  const summary = useMemo(() => parseSummary(inputText), [inputText]);
  const stats = useMemo(() => {
    const s = computeStats(treeRoots);
    s.totalSize = summary.totalSize;
    s.volumes = summary.volumes;
    return s;
  }, [treeRoots, summary]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result;
        if (typeof text === "string") setInputText(text);
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      {/* Background glow */}
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold mb-3"
        >
          <span className="gradient-text">Tree Visualizer</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-default-500 text-lg max-w-xl mx-auto"
        >
          Paste your <code className="text-primary font-mono text-sm bg-primary/10 rounded px-1.5 py-0.5">tree</code> command
          output and explore it interactively
        </motion.p>
      </div>

      {/* Input area */}
      <AnimatePresence mode="wait">
        {!hasVisualized ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-default-200 dark:border-default-100">
              <CardBody className="p-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="relative"
                >
                  <Textarea
                    label="Tree Output"
                    placeholder={`Paste your tree output here...\n\nExample:\n/home/user\n|-- Documents\n|   |-- file1.txt\n|   \\-- file2.pdf\n\\-- Downloads\n    \\-- video.mp4`}
                    value={inputText}
                    onValueChange={setInputText}
                    minRows={12}
                    maxRows={20}
                    classNames={{
                      input: "font-mono text-sm",
                      inputWrapper: "drop-zone-pulse border-2 border-dashed border-default-300 dark:border-default-200",
                    }}
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-default-400 pointer-events-none">
                    <Icon icon="solar:upload-minimalistic-bold" width={14} />
                    Drop a .txt file here
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Button
                    color="primary"
                    size="lg"
                    onPress={handleVisualize}
                    isDisabled={!inputText.trim()}
                    startContent={<Icon icon="solar:play-bold" width={20} />}
                    className="font-medium"
                  >
                    Visualize
                  </Button>
                  <Button
                    variant="flat"
                    size="lg"
                    onPress={handleLoadSample}
                    startContent={<Icon icon="solar:test-tube-bold-duotone" width={20} />}
                  >
                    Load Sample
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="tree"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats cards */}
            <StatsCards stats={stats} />

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4">
              <Input
                placeholder="Search files & folders..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<Icon icon="solar:magnifer-bold" width={18} className="text-default-400" />}
                isClearable
                onClear={() => setSearchQuery("")}
                classNames={{
                  inputWrapper: "bg-content1/50 backdrop-blur-sm border border-default-200 dark:border-default-100",
                }}
                className="max-w-sm"
                size="sm"
              />
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => setHasVisualized(false)}
                  startContent={<Icon icon="solar:pen-bold" width={16} />}
                >
                  Edit
                </Button>
                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  onPress={handleClear}
                  startContent={<Icon icon="solar:trash-bin-minimalistic-bold" width={16} />}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Tree view */}
            <Card className="bg-content1/50 backdrop-blur-sm border border-default-200 dark:border-default-100">
              <CardBody className="p-4 max-h-[70vh] overflow-auto">
                {filteredRoots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-default-400">
                    <Icon icon="solar:ghost-bold-duotone" width={48} className="mb-3" />
                    <p className="text-sm">No matches found</p>
                  </div>
                ) : (
                  <TreeView roots={filteredRoots} searchQuery={searchQuery} />
                )}
              </CardBody>
            </Card>

            {/* Summary bar */}
            <SummaryBar stats={stats} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
