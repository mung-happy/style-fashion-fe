import { Link } from "react-router-dom";
import { localUserService } from "../../services/localService";
import { https } from "../../config/axios";
import { hiddenSpinner, showSpinner } from "../../util";
import { message } from "antd";

const User = () => {
  const infoUser = localUserService.get();

  const handleLogOut = async () => {
    localUserService.remove();
    const data = {
      refreshToken: infoUser?.tokens.refresh.token,
    }
    showSpinner();
    await https.post('/auth/logout', data)
    hiddenSpinner();
    message.success("Đăng xuất thành công!");
    setTimeout(() => {
      window.location.href = "/";
    }, 400);
  };

  return (
    <div className="flex items-center">
      <button className="relative group lg:w-12 w-10 h-10 lg:h-12 flex justify-center items-center text-slate-700 rounded-full hover:bg-slate-100">
        <svg
          className=" w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="group-hover:visible group-hover:opacity-100 invisible duration-300 absolute transform z-10 w-40 top-full right-0 opacity-0">
          <ul className="rounded-lg shadow-lg border border-neutral-100 text-sm relative bg-white py-4 grid gap-1">
            {infoUser ? (
              <>
                <li className="px-2">
                  <Link
                    className="flex items-center font-normal text-neutral-600 py-2 px-4 rounded-md hover:bg-neutral-100"
                    to="/account"
                  >
                    Thông tin
                  </Link>
                </li>
                {infoUser.user.role === "admin" ? (
                  <li className="px-2">
                    <Link
                      className="flex items-center font-normal text-neutral-600 py-2 px-4 rounded-md hover:bg-neutral-100"
                      to="/admin/products"
                    >
                      Quản trị
                    </Link>
                  </li>
                ) : (
                  <></>
                )}
                <li className="px-2">
                  <div
                    onClick={handleLogOut}
                    className="flex items-center font-normal text-neutral-600 py-2 px-4 rounded-md hover:bg-neutral-100"
                  >
                    Đăng xuất
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="px-2">
                  <Link
                    className="flex items-center font-normal text-neutral-600 py-2 px-4 rounded-md hover:bg-neutral-100"
                    to="/auth/login"
                  >
                    Đăng nhập
                  </Link>
                </li>
                <li className="px-2">
                  <Link
                    className="flex items-center font-normal text-neutral-600 py-2 px-4 rounded-md hover:bg-neutral-100"
                    to="/auth/register"
                  >
                    Đăng ký
                  </Link>
                </li>
                {/* <li className="px-2">
                  <Link
                    className="flex items-center font-normal text-neutral-600 py-2 px-4 rounded-md hover:bg-neutral-100"
                    to="/portfolio"
                  >
                    Portfolio
                  </Link>
                </li> */}
              </>
            )}
          </ul>
        </div>
      </button>
      {infoUser ? (
        <div className="text-xs text-slate-700">
          Hi,
          {infoUser.user.name.split(" ")[0]}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default User;