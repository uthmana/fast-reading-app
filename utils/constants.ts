// app/components/menuData.ts
export const menuItems = [
  {
    name: "Dersler",
    link: "/dersler",
    subMenu: [
      { name: "Dersler", link: "/dersler" },
      { name: "Takistoskop", link: "/takistoskop" },
      { name: "Hızlı Okuma Gelişimi", link: "/goster-kendini/gelisim" },
    ],
    description: "Tüm dersler",
    youtubeId: "",
  },
  {
    name: "Göz Egzersizleri",
    link: "/goz-egzersiz",
    subMenu: [
      {
        name: "Göz Egzersizleri",
        link: "/goz-egzersiz",
      },
      {
        name: "Ritmini Renklendirme",
        link: "/goz-egzersiz/ritmini-renklendirme",
      },
      { name: "Siyah-Beyaz", link: "/goz-egzersiz/siyah-beyaz" },
      { name: "Geniş Bakış", link: "/goz-egzersiz/genis-bakis" },
      { name: "Dörtlu Kelimeler", link: "/goz-egzersiz/dortlu-kelimeler" },
      { name: "Kelimelerin Dansı", link: "/goz-egzersiz/kelimelerin-dansi" },
      { name: "Satır Arası", link: "/goz-egzersiz/satir-arasi" },
      {
        name: "Satır Başı-Satrır sonu",
        link: "/goz-egzersiz/satir-basi-satir-sonu",
      },
      { name: "Zigzag", link: "/goz-egzersiz/zigzag" },
    ],
    description:
      "Göz egzersizlerindeki temel amaç göze hız kazandırmak, göz kaslarını güçlendirmek, gözün görme çevikliğini artırmak. Bu uygulamadan yeterince yararlanmak için her egzersizi 1. sevi- den 5. seviyeye kadar kademe kademe uygulayınız.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Okuma Egzersizleri",
    link: "/okuma-egzersiz",
    subMenu: [
      { name: "Okuma Egzersizleri", link: "/okuma-egzersiz" },
      { name: "Kelimeler-1", link: "/okuma-egzersiz/kelimeler-1" },
      { name: "Kelimeler-2", link: "/okuma-egzersiz/kelimeler-2" },
      { name: "Kelimeler-3", link: "/okuma-egzersiz/kelimeler-3" },
      { name: "Kelimeler-4", link: "/okuma-egzersiz/kelimeler-4" },
      { name: "Kelimeler-5", link: "/okuma-egzersiz/kelimeler-5" },
      { name: "Sayılar-1", link: "/okuma-egzersiz/sayilar-1" },
      { name: "Sayılar-2", link: "/okuma-egzersiz/sayilar-2" },
      { name: "Sayılar-3", link: "/okuma-egzersiz/sayilar-3" },
      { name: "Sayılar-4", link: "/okuma-egzersiz/sayilar-4" },
      { name: "Sayılar-5", link: "/okuma-egzersiz/sayilar-5" },
      { name: "Kayan Okuma", link: "/okuma-egzersiz/kayan-okuma" },
    ],
    description:
      "Okuma egzersizlerindeki temel amaç göze hız kazandırmak, göz kaslarını güçlendirmek, gözün kelimeleri hızlı tanımasını sağlamak.Bu uygulamadan yeterince yararlanmak için her egzersizi 1. seviden 5. seviyeye kadar kademe kademe uygulayınız.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Takistoskop",
    link: "/takistoskop",
    subMenu: [
      { name: "Takistoskop", link: "/takistoskop" },
      { name: "Hızlı Görme", link: "/takistoskop/hizli-gorme" },
    ],
    description:
      "Hızlı Görme Uygulaması Takistoskop çalışmaları, gözün kelime veya kelime gruplarını 100ms ile 1000ms (1sn=1000ms) arasında bir hızla gösterip, gözünüzün görme hızını arttırır.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Hızlı Oku",
    link: "/hizli-oku",
    subMenu: [
      {
        name: "Hızlı Oku",
        link: "/hizli-oku",
      },
      {
        name: "Silinmeden Blok Okuma",
        link: "/hizli-oku/silinmeden-blok-okuma",
      },
      { name: "Silinerek Blok Okuma", link: "/hizli-oku/silinerek-blok-okuma" },
      { name: "Odaklı Blok Okuma", link: "/hizli-oku/odakli-blok-okuma" },
      { name: "Hızlı Okuma Gelişimi", link: "/hizli-oku/gelisimi" },
    ],
    description:
      "Takistoskop çalışmasının en büyük kazanımı kelimeleri grup halde algılaya bilmektir. Bu edindiğimiz beceriyi metinler üzerinde uygulayabilmek için bloklama egzersizleri yapmak gerekmektedir. Bu egzersiz, göze metin üzerinde sıçrama noktalarını öğreterek, gözün metin üzerinde seri bir şekilde akmasını sağlar.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Göster Kendini",
    link: "/goster-kendini",
    subMenu: [
      { name: "Göster Kendini", link: "/goster-kendini" },
      { name: "Hızlı Okuma Gelişimi", link: "/goster-kendini/gelisim" },
      { name: "Anlama Gelişimi", link: "/goster-kendini/gelisim" },
    ],
    description: "Göster Kendini",
    youtubeId: "xiTK523Ot5U",
  },
];

export const lessons = {
  "1": [
    {
      name: "Ritmini Renklendirme",
      link: "/goz-egzersiz/ritmini-renklendirme",
    },
    { name: "Kelimeler-1", link: "/okuma-egzersiz/kelimeler-1" },
    { name: "Takistoskop", link: "/takistoskop/hizli-gorme" },
    {
      name: "Silinmeden Blok Okuma",
      link: "/hizli-oku/silinmeden-blok-okuma",
    },
    { name: "Silinerek Blok Okuma", link: "/hizli-oku/silinerek-blok-okuma" },
  ],
  "2": [
    { name: "Siyah-Beyaz", link: "/goz-egzersiz/siyah-beyaz" },
    { name: "Geniş Bakış", link: "/goz-egzersiz/genis-bakis" },
    { name: "Kelimeler-1", link: "/okuma-egzersiz/kelimeler-1" },
    { name: "Takistoskop", link: "/takistoskop/hizli-gorme" },
    {
      name: "Silinmeden Blok Okuma",
      link: "/hizli-oku/silinmeden-blok-okuma",
    },
    { name: "Silinerek Blok Okuma", link: "/hizli-oku/silinerek-blok-okuma" },
  ],
  "3": [
    { name: "Kelimeler-5", link: "/okuma-egzersiz/kelimeler-5" },
    { name: "Sayılar-1", link: "/okuma-egzersiz/sayilar-1" },
    { name: "Sayılar-2", link: "/okuma-egzersiz/sayilar-2" },
    { name: "Sayılar-3", link: "/okuma-egzersiz/sayilar-3" },
    { name: "Kelimeler-1", link: "/okuma-egzersiz/kelimeler-1" },
    { name: "Takistoskop", link: "/takistoskop/hizli-gorme" },
    {
      name: "Silinmeden Blok Okuma",
      link: "/hizli-oku/silinmeden-blok-okuma",
    },
    { name: "Silinerek Blok Okuma", link: "/hizli-oku/silinerek-blok-okuma" },
  ],
};

export const playlists = [
  {
    type: "audio/mpeg",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga",
  },
  {
    type: "audio/mpeg",
    src: "https://www.coothead.co.uk/audio/You-Cant-Always-Get-What-You-Want.mp3",
  },
];
