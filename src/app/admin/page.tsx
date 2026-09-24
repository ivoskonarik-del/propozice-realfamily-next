import type { Metadata } from "next";
import AdminPanel from "./AdminPanel";

export const metadata: Metadata = {
  title: "Správa nabídek",
  // Administrace nepatří do vyhledávačů ani do sitemapy.
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <AdminPanel />;
}
