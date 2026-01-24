// nav.config.ts
export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

export const routes: NavItem[] = [
  {
    label: "Hızlı Okuma",
    href: "/#hizliokuma",
    children: [
      { label: "Hızlı Okuma Tarihçesi", href: "/blog/hizli-okuma-tarihcesi" },
      { label: "Anlayarak Hızlı Okuma", href: "/blog/anlayarak-hizli-okuma" },
      { label: "Eğitim Şeklimiz", href: "/blog/egitim-sekilimiz" },
      { label: "Neden SeriOku?", href: "/blog/neden-serioku" },
    ],
  },
  {
    label: "Eğitim Grubu",
    href: "/#egitim-grubu",
  },
  {
    label: "Eğitmenlerimiz",
    href: "/#egitmenlerimiz",
  },
  {
    label: "Bayilik",
    href: "/bayilik",
  },
  {
    label: "Kurumsal",
    children: [
      { label: "Hakkımızda", href: "/kurumsal/hakkimizda" },
      { label: "Gizlilik Politikası", href: "/kurumsal/gizlilik-politikasi" },
      { label: "Kullanım Şartları", href: "/kurumsal/kullanim-sartlari" },
      { label: "İletişim", href: "/kurumsal/iletisim" },
    ],
  },
];
