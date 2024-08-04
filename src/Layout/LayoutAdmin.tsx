import User from "../components/User/User";
import Search from "../components/Admin/AdminMenu/Search/Search";
import AdminMenu from "../components/Admin/AdminMenu/AdminMenu";
import { localUserService } from "../services/localService";
import { Outlet } from "react-router-dom";

function LayoutAdmin() {
  // if (localUserService.get()?.role !== "admin") {
  //   window.location.href = "/";
  // }
  return (
    <div className="flex min-h-screen w-full bg-bg">
      <AdminMenu />

      <div className="flex-grow px-4 flex flex-col">
        <nav className="flex items-center justify-between py-2">
          <h6 className="font-bold capitalize text-primary">Style Fashion. admin</h6>
          <div className="flex items-center sm:flex-row flex-col-reverse">
            <Search className="border rounded-lg" />
            <User />
          </div>
        </nav>
        <div className="flex-grow relative flex flex-col min-w-0 mb-6 bg-white shadow-sm rounded-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayoutAdmin;
