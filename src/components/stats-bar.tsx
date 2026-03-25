"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TreeStats } from "@/lib/tree-parser";

interface StatsProps {
  stats: TreeStats;
}

export function StatsCards({ stats }: StatsProps) {
  const topExtensions = Object.entries(stats.extensions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <StatCard
        icon="solar:folder-bold-duotone"
        iconColor="#fbbf24"
        label="Folders"
        value={stats.totalFolders}
      />
      <StatCard
        icon="solar:file-bold-duotone"
        iconColor="#6366f1"
        label="Files"
        value={stats.totalFiles}
      />
      <StatCard
        icon="solar:layers-bold-duotone"
        iconColor="#ec4899"
        label="Max Depth"
        value={stats.maxDepth}
      />
      <Card className="bg-content1/50 backdrop-blur-sm border border-default-200 dark:border-default-100">
        <CardBody className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon="solar:pie-chart-2-bold-duotone" width={18} style={{ color: "#22d3ee" }} />
            <span className="text-xs text-default-500 font-medium">Top Types</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {topExtensions.length === 0 ? (
              <span className="text-xs text-default-400">—</span>
            ) : (
              topExtensions.map(([ext, count]) => (
                <Chip key={ext} size="sm" variant="flat" className="h-5 text-[10px]">
                  .{ext} ({count})
                </Chip>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: string;
  iconColor: string;
  label: string;
  value: number;
}) {
  return (
    <Card className="bg-content1/50 backdrop-blur-sm border border-default-200 dark:border-default-100">
      <CardBody className="p-3 flex flex-row items-center gap-3">
        <div className="p-2 rounded-lg bg-default-100">
          <Icon icon={icon} width={22} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          <p className="text-xs text-default-500">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export function SummaryBar({ stats }: StatsProps) {
  const total = stats.totalFiles + stats.totalFolders;
  const filePercent = total > 0 ? (stats.totalFiles / total) * 100 : 0;

  const topExtensions = Object.entries(stats.extensions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="mt-4 rounded-xl bg-content1/60 backdrop-blur-sm border border-default-200 dark:border-default-100 px-5 py-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1.5 text-xs text-default-500">
          <Icon icon="solar:pie-chart-2-bold-duotone" width={14} style={{ color: "#22d3ee" }} />
          Composition
        </span>
        <span className="text-xs text-default-400">
          {total.toLocaleString()} item{total !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="h-2 rounded-full bg-default-200 dark:bg-default-100 overflow-hidden flex">
        <div
          className="h-full bg-warning-400 rounded-l-full transition-all duration-500"
          style={{ width: `${100 - filePercent}%` }}
          title={`${stats.totalFolders} folders`}
        />
        <div
          className="h-full bg-primary-500 rounded-r-full transition-all duration-500"
          style={{ width: `${filePercent}%` }}
          title={`${stats.totalFiles} files`}
        />
      </div>
      <div className="flex items-center gap-4 mt-1.5">
        <span className="flex items-center gap-1 text-[11px] text-default-400">
          <span className="w-2 h-2 rounded-full bg-warning-400 inline-block" />
          Folders {total > 0 ? `${(100 - filePercent).toFixed(1)}%` : ""}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-default-400">
          <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
          Files {total > 0 ? `${filePercent.toFixed(1)}%` : ""}
        </span>
        <span className="ml-auto flex items-center gap-3">
          <span className="text-xs text-default-500">
            {stats.totalFolders.toLocaleString()} folder{stats.totalFolders !== 1 ? "s" : ""}, {stats.totalFiles.toLocaleString()} file{stats.totalFiles !== 1 ? "s" : ""}
          </span>
          {stats.totalSize && (
            <span className="text-xs font-semibold text-default-600">
              {stats.totalSize}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
