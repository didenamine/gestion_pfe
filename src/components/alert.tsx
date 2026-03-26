import React from "react";
import { Button } from "@/components/ui/button";
import {
  Alert as AlertRoot,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

type AlertProps = {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  onClose?: () => void;
};

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  message,
  onClose,
}) => {
  if (!message) return null;

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "success":
        return "Success!";
      case "warning":
        return "Warning!";
      case "error":
        return "Error!";
      default:
        return "Info!";
    }
  };

  return (
    <AlertRoot className="w-full">
      <InfoIcon />
      <AlertTitle>{getTitle()}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onClose && (
        <div className="mt-2">
          {/* <Button variant="outline" size="sm" onClick={onClose}>
            Dismiss
          </Button> */}
        </div>
      )}
    </AlertRoot>
  );
};
