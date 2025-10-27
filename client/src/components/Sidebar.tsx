import React, { useState } from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdTaskAlt,
  MdOutlineExpandMore,
  MdOutlineExpandLess,
} from "react-icons/md";
import { FaTasks, FaRocket } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import { AppDispatch } from "../redux/store";

interface NavItem {
  label: string;
  link: string;
  icon: React.ReactNode;
  badge?: number | null;
  description: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "Core",
    items: [
      {
        label: "Dashboard",
        link: "dashboard",
        icon: <MdDashboard size={20} />,
        badge: null,
        description: "Overview & analytics",
      },
      {
        label: "Tasks",
        link: "tasks",
        icon: <FaTasks size={20} />,
        badge: null,
        description: "Manage all tasks",
      },
    ],
  },
  {
    title: "Task Management",
    items: [
      {
        label: "To Do",
        link: "tasks/todo",
        icon: <MdOutlineAddTask size={20} />,
        badge: null,
        description: "Pending tasks",
      },
      {
        label: "In Progress",
        link: "tasks/in-progress",
        icon: <MdOutlinePendingActions size={20} />,
        badge: null,
        description: "Active tasks",
      },
      {
        label: "Completed",
        link: "tasks/completed",
        icon: <MdTaskAlt size={20} />,
        badge: null,
        description: "Finished tasks",
      },
    ],
  },
];

interface NavLinkProps {
  item: NavItem;
}

const Sidebar: React.FC = () => {
  // const { user } = useSelector(
  //   (state: RootState) => state.auth as { user: User | null }
  // );
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const NavLink: React.FC<NavLinkProps> = ({ item }) => {
    const isActive = location.pathname === `/${item.link}`;
    return (
      <Link
        to={item.link}
        onClick={closeSidebar}
        className={clsx(
          "group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-700/50",
          isActive && "bg-primary-900/20 border-l-4 border-l-primary-500"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
        )}

        <div
          className={clsx(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
            isActive
              ? "bg-primary-900/40 text-primary-400"
              : "bg-gray-700 text-gray-400 group-hover:bg-primary-900/30 group-hover:text-primary-400"
          )}
        >
          {item.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "font-medium transition-colors",
                isActive ? "text-primary-300" : "text-white"
              )}
            >
              {item.label}
            </span>
            {item.badge && (
              <span className="px-2 py-1 text-xs font-medium bg-accent-900/30 text-accent-300 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          <p
            className={clsx(
              "text-xs mt-0.5 transition-colors",
              isActive ? "text-primary-400" : "text-gray-400"
            )}
          >
            {item.description}
          </p>
        </div>
      </Link>
    );
  };

  interface NavigationSectionProps {
    section: NavSection;
  }

  const NavigationSection: React.FC<NavigationSectionProps> = ({ section }) => {
    const isCollapsed = collapsedSections[section.title];

    return (
      <div className="space-y-2">
        <button
          onClick={() => toggleSection(section.title)}
          className="w-full flex items-center justify-between p-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-700/30"
        >
          <span className="uppercase tracking-wide">{section.title}</span>
          {isCollapsed ? (
            <MdOutlineExpandMore size={16} />
          ) : (
            <MdOutlineExpandLess size={16} />
          )}
        </button>

        {!isCollapsed && (
          <div className="space-y-1 ml-2">
            {section.items.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "relative h-full flex flex-col transition-all duration-300 ease-in-out w-80"
      )}
    >
      {/* Main Sidebar Content */}
      <div className="flex-1 flex flex-col gap-6 p-4 bg-gray-800 border-r border-gray-700">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700 shadow-glow">
              <FaRocket className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Nexus
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 flex flex-col gap-6 py-4">
          {navigationSections.map((section) => (
            <NavigationSection key={section.title} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
