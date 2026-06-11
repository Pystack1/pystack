import { createFileRoute, Outlet } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";

export const Route = createFileRoute("/user/dashboard")({
  component: UserLayout,
});