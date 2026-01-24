import { useState } from "react";
import Link from "next/link";
import Icon from "../icon/icon";
import { NavItem } from "./routes";

type DropdownProps = {
  item: NavItem;
  mobile?: boolean;
  onClick?: () => void;
  linkBase: string;
  dropdownWrapper: string;
  dropdownMenu: string;
  dropdownItem: string;
};

export function Dropdown({
  item,
  mobile,
  onClick,
  linkBase,
  dropdownWrapper,
  dropdownMenu,
  dropdownItem,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    if (mobile) {
      setOpen((prev) => !prev);
    }
  };

  const handleChildClick = () => {
    setOpen(false);
    onClick?.();
  };

  return (
    <div className={dropdownWrapper}>
      {/* Trigger */}
      {item.href && !mobile ? (
        <Link href={item.href} onClick={onClick}>
          <Trigger
            label={item.label}
            open={open}
            mobile={mobile}
            linkBase={linkBase}
          />
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          className="w-full text-left"
        >
          <Trigger
            label={item.label}
            open={open}
            mobile={mobile}
            linkBase={linkBase}
          />
        </button>
      )}

      {/* Menu */}
      <div
        className={`
          ${dropdownMenu}
          ${mobile && open ? "block" : ""}
          ${mobile && !open ? "hidden" : ""}
        `}
      >
        {item.children?.map((child) => (
          <Link
            key={child.label}
            href={child.href!}
            onClick={handleChildClick}
            className={dropdownItem}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
function Trigger({
  label,
  open,
  mobile,
  linkBase,
}: {
  label: string;
  open: boolean;
  mobile?: boolean;
  linkBase: string;
}) {
  return (
    <span className={`flex items-center gap-1 ${linkBase} cursor-pointer`}>
      {label}
      <Icon
        name="chevron-down"
        className={`
          h-4 w-4 transition-transform
          ${open ? "rotate-180" : ""}
          ${!mobile ? "group-hover:rotate-180" : ""}
        `}
      />
    </span>
  );
}
