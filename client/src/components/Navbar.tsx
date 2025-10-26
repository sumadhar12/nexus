import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import { RootState } from "../redux/store";
import { AppDispatch } from "../redux/store";
import { User } from "@/types";

const Navbar: React.FC = () => {
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: User | null }
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      // Call the server logout endpoint to clear the HTTP-only cookie
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // Clear any client-side cookies
      Cookies.remove("token");

      toast.success("Logged out successfully!");
      navigate("/login");
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
      Cookies.remove("token");
      toast.success("Logged out successfully!");
      navigate("/login");
      dispatch(logout());
    }
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 px-4 py-3 lg:py-4 sticky z-10 top-0 border-b border-gray-700 shadow-sm backdrop-blur-sm">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-400 hover:text-primary-400 block lg:hidden transition-colors p-2 rounded-lg hover:bg-gray-700"
        >
          ☰
        </button>
      </div>

      <div className="flex gap-3 items-center">
        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="p-3 py-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 shadow-glow">
            <p className="text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </p>
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              {user?.name || "User"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium text-sm"
        >
          <IoLogOutOutline size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
