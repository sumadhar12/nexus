import { Tab } from "@headlessui/react";
import { ReactNode } from "react";

interface TabItem {
  title: string;
  icon: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  setSelected: (index: number) => void;
  children: ReactNode;
}

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setSelected, children }: TabsProps) {
  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-700 p-1 mb-6">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.title}
              onClick={() => setSelected(index)}
              className={({ selected }) =>
                classNames(
                  "w-full flex items-center justify-center outline-none gap-2 px-4 py-3 text-sm font-medium leading-5 rounded-lg transition-all duration-200",
                  selected
                    ? "text-white bg-gradient-to-r from-primary-600 to-accent-600 shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-600"
                )
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="w-full">{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}

