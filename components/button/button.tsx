import { ReactElement } from "react";
import Icon from "../icon/icon";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  text: string;
  onClick?: (e: React.FormEvent) => void;
  className?: string;
  isSubmiting?: boolean;
  disabled?: boolean;
  icon?: ReactElement;
  loading?: boolean;
};

export default function Button({
  type = "button",
  text,
  onClick,
  className,
  disabled,
  isSubmiting,
  icon,
  loading,
}: ButtonProps) {
  return (
    <button
      disabled={isSubmiting || disabled}
      type={type}
      onClick={onClick}
      className={`bg-blue-500 flex items-center justify-center gap-2 text-white px-4 py-2 rounded w-full ${
        disabled ? "opacity-30" : ""
      } ${className}`}
    >
      {isSubmiting || loading ? (
        <Icon name="loading" className="w-8 h-8 text-gray-600" />
      ) : null}
      {icon}
      {text}
    </button>
  );
}
