import { createFileRoute, Outlet } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";

export const Route = createFileRoute("/dashboard")({
  component: UserLayout,
});