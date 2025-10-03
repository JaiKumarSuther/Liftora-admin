import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liftora - Admin Dashboard",
  description: "Liftora Admin Dashboard - Complete User Management & Analytics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
