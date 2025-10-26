import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface ModalWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ open, setOpen, children, title, size = "md" }) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-7xl",
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 w-full"
        initialFocus={cancelButtonRef}
        onClose={() => setOpen(false)}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            data-no-navigate
          />
        </Transition.Child>

        <div
          className="fixed inset-0 z-50 w-screen overflow-y-auto"
          data-no-navigate
        >
          <div
            className="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
            data-no-navigate
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`w-full relative transform overflow-hidden rounded-2xl bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full ${sizeClasses[size]} border border-gray-700`}
                data-no-navigate
              >
                {/* Header */}
                {title && (
                  <div className="bg-gradient-to-r from-primary-900/20 to-accent-900/20 px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-xl font-bold text-white">
                        {title}
                      </Dialog.Title>
                      <button
                        ref={cancelButtonRef}
                        onClick={() => setOpen(false)}
                        className="rounded-full p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 transition-all duration-200"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-6">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalWrapper;

