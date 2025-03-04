import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner"; // Ensure this import is correct

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen m-2 md:m-0">
      {/* Navbar  */}
      <header>
        <Navbar />
      </header>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors closeButton />

      {/* Main content  */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer  */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
