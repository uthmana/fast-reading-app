"use client";

import Link from "next/link";
import { routes } from "./routes";
import { Dropdown } from "./dropDown";

type NavLinksProps = {
  mobile?: boolean;
  onClick?: () => void;
};

export default function NavLinks({ mobile, onClick }: NavLinksProps) {
  const linkBase = mobile
    ? "block text-base font-medium transition hover:text-brand-secondary-150"
    : "text-sm font-roboto font-medium transition hover:text-brand-secondary-150";

  const dropdownWrapper = mobile ? "space-y-2" : "relative group";

  const dropdownMenu = mobile
    ? "pl-4 space-y-2"
    : `
    absolute left-0 top-full
    hidden min-w-[200px]
    rounded-lg bg-white
    text-brand-primary-200
    shadow-lg
    group-hover:block
    pt-2
  `;
  const dropdownItem = mobile ? linkBase : "block px-4 py-2 hover:bg-gray-100";

  return (
    <>
      {routes.map((item) =>
        item.children ? (
          <Dropdown
            key={item.label}
            item={item}
            mobile={mobile}
            onClick={onClick}
            linkBase={linkBase}
            dropdownWrapper={dropdownWrapper}
            dropdownMenu={dropdownMenu}
            dropdownItem={dropdownItem}
          />
        ) : (
          <Link
            key={item.label}
            href={item.href!}
            onClick={onClick}
            className={linkBase}
          >
            {item.label}
          </Link>
        )
      )}
    </>
  );
}
