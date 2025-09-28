import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main
          className="p-4"
          style={{ flex: 1, overflowY: "auto", backgroundColor: "#f8f9fa" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
