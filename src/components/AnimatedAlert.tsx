import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface AnimatedAlertProps {
  type: "success" | "error";
  message: string;
}

export const AnimatedAlert: React.FC<AnimatedAlertProps> = ({ type, message }) => (
  <div
    className={`
      flex items-center gap-2 px-4 py-3 rounded-md mb-4
      ${type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      animate-fade-in-up shadow transition-all
    `}
    style={{ animationDuration: "0.5s" }}
  >
    {type === "success" ? (
      <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-red-500 animate-shake" />
    )}
    <span className="font-medium">{message}</span>
  </div>
); 