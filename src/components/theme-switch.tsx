"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Icon
        icon={theme === "dark" ? "solar:sun-bold" : "solar:moon-bold"}
        width={20}
      />
    </Button>
  );
}
