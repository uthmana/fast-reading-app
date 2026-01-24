"use client";

import { useState } from "react";
import Link from "next/link";
import NavLinks from "./navLinks";
import Icon from "../icon/icon";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 font-roboto z-50 bg-brand-primary-150 text-white">
        <div className="mx-auto landing-container px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <Icon name="logo" className="h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4">
            <NavLinks />
            <div className="flex gap-3">
              <Link
                href="/login?giris=ogrenci"
                className="rounded-lg bg-brand-secondary-150 px-4 py-2 font-semibold text-brand-primary-200 hover:bg-brand-secondary-200 transition"
              >
                Öğrenci Giriş
              </Link>

              <Link
                href="/login?giris=egtmen"
                className="rounded-lg border border-brand-secondary-150 px-4 py-2 font-semibold text-brand-secondary-150 hover:bg-brand-secondary-50 transition"
              >
                Eğitmen Giriş
              </Link>
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10"
            aria-label="Menüyü aç"
          >
            <span className="sr-only">Menüyü aç</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in Mobile Menu */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-brand-primary-200 text-white transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <span className="text-lg font-bold">Menü</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Menüyü kapat"
            className="p-2 hover:bg-white/10 rounded-md"
          >
            ✕
          </button>
        </div>

        <nav className="px-6 py-6 space-y-6">
          <NavLinks mobile onClick={() => setOpen(false)} />

          <div className="pt-6  space-y-3 border-t border-white/10">
            <Link
              href="/ogrenci/giris"
              onClick={() => setOpen(false)}
              className="block w-full rounded-lg bg-brand-secondary-150 px-4 py-3 text-center font-semibold text-brand-primary-200 hover:bg-brand-secondary-200 transition"
            >
              Öğrenci Giriş
            </Link>

            <Link
              href="/egitmen/giris"
              onClick={() => setOpen(false)}
              className="block w-full rounded-lg border border-brand-secondary-150 px-4 py-3 text-center font-semibold text-brand-secondary-150 hover:bg-brand-secondary-50 transition"
            >
              Eğitmen Giriş
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
