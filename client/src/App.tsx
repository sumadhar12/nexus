import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import { AppDispatch, RootState } from "./redux/store";
import { setCredentials, setOpenSidebar } from "./redux/slices/authSlice";
import { Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Tasks from "./pages/Tasks";

function Layout() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      dispatch(setCredentials(JSON.parse(localStorage.getItem("userInfo")!)));
    }
  }, [dispatch]);

  const location = useLocation();
  return user ? (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="h-screen bg-gray-800 hidden lg:flex flex-col border-r border-gray-700 shadow-lg transition-all duration-300 ease-in-out z-10">
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content - Separate scrollable area */}
      <div className="flex-1 flex flex-col min-h-screen content-wrapper">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto main-scroll main-content-area">
          <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto min-h-full overflow-fix">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="transition-all duration-300 ease-in"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-full"
      >
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-80 bg-gray-800 shadow-2xl border-l border-gray-700">
            <div className="flex justify-end p-4">
              <button
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <IoClose size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="px-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

function App() {
  return (
    <>
      <main className="w-full min-h-screen bg-gray-900">
        <Routes>
          <Route element={<Layout />}>
            <Route index path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:status" element={<Tasks />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: "bg-gray-800 text-white",
          }}
        />
      </main>
    </>
  );
}

export default App;
