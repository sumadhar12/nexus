import clsx from "clsx";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

interface ConfirmatioDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  msg?: string;
  setMsg?: (msg: string | null) => void;
  onClick?: () => void;
  type?: "delete";
  setType?: (type: "delete") => void;
}

export default function ConfirmatioDialog({
  open,
  setOpen,
  msg,
  setMsg = () => {},
  onClick = () => {},
  type = "delete",
  setType = () => {},
}: ConfirmatioDialogProps) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  const getIconAndColors = (type: string) => {
    switch (type) {
      case "restore":
      case "restoreAll":
        return {
          icon: <FaCheckCircle size={48} />,
          iconBg: "bg-amber-900/30",
          iconColor: "text-amber-400",
          buttonBg: "bg-amber-600 hover:bg-amber-700",
          buttonHover: "hover:bg-amber-700",
        };
      default:
        return {
          icon: <FaExclamationTriangle size={48} />,
          iconBg: "bg-red-900/30",
          iconColor: "text-red-400",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonHover: "hover:bg-red-700",
        };
    }
  };

  const { icon, iconBg, iconColor, buttonBg } = getIconAndColors(type);

  return (
    <ModalWrapper
      open={open}
      setOpen={closeDialog}
      title={"Confirm Delete"}
      size="sm"
    >
      <div className="py-6 w-full flex flex-col gap-6 items-center justify-center">
        {/* Icon */}
        <div className={clsx("p-4 rounded-full", iconBg)}>
          <div className={iconColor}>{icon}</div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-white">{"Delete Item"}</p>
          <p className="text-gray-400 max-w-sm">
            {msg ??
              "Are you sure you want to perform this action? This cannot be undone."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            className={clsx(
              "w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 transform hover:scale-105",
              buttonBg
            )}
            onClick={onClick}
            label={"Delete"}
          />

          <Button
            type="button"
            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={closeDialog}
            label="Cancel"
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
