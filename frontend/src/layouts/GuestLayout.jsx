import { Outlet } from "react-router-dom";

import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { guestFlow } from "../routes/appRoutes";

function GuestLayout() {
  return (
    <div className="min-h-screen">
      <Navbar links={guestFlow} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default GuestLayout;
