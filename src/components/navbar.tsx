"use client";

import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ThemeSwitch } from "./theme-switch";

export function Navbar() {
  return (
    <HeroNavbar maxWidth="xl" isBordered>
      <NavbarBrand className="gap-2">
        <Icon icon="solar:tree-bold-duotone" width={28} className="text-primary" />
        <p className="font-bold text-inherit text-lg">Tree Visualizer</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
