export const menuItems = [
  {
    name: "Dersler",
    link: "/dersler",
    icon: "lesson",
    subMenu: [
      { name: "Dersler", link: "/dersler", type: "info" },
      {
        name: "Ders Videoları",
        link: "/dersler/videolar",
        type: "info",
      },
      {
        name: "Takistoskop Gelişimi",
        link: "/kelime-egzersizleri/seviye-gelisim",
        type: "info",
      },
      {
        name: "Hızlı Okuma Gelişimi",
        link: "/okuma-anlama-testleri/hizli-okuma-testi-gelisim",
        type: "info",
      },
      {
        name: "Anlama Gelişimi",
        link: "/okuma-anlama-testleri/anlama-testi-gelisim",
        type: "info",
      },
    ],
    description: "Tüm dersler",
    youtubeId: "",
  },
  {
    name: "Göz Egzersizleri",
    link: "/goz-egzersizleri",
    icon: "eye",
    subMenu: [
      {
        name: "Göz Egzersizleri",
        link: "/goz-egzersizleri",
      },
      {
        name: "Göz Kaslarını Geliştirme",
        link: "/goz-egzersizleri/goz-kaslarini-gelistirme",
      },
      {
        name: "Aktif Görme Alanını Genişletme 1",
        link: "/goz-egzersizleri/aktif-gorme-alanini-genisletme-1",
      },
      {
        name: "Aktif Görme Alanını Genişletme 2",
        link: "/goz-egzersizleri/aktif-gorme-alanini-genisletme-2",
      },
      {
        name: "Aktif Görme Alanını Genişletme 3",
        link: "/goz-egzersizleri/aktif-gorme-alanini-genisletme-3",
      },
      {
        name: "Satır Boyu Görme",
        link: "/goz-egzersizleri/satir-boyu-gorme-uygulamasi",
      },
      { name: "Metronom", link: "/goz-egzersizleri/metronom" },
    ],
    description:
      "Göz egzersizlerindeki temel amaç göze hız kazandırmak, göz kaslarını güçlendirmek, gözün görme çevikliğini artırmak. Bu uygulamadan yeterince yararlanmak için her egzersizi 1. sevi- den 5. seviyeye kadar kademe kademe uygulayınız.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Beyin Egzersizleri",
    link: "/beyin-egzersizleri",
    icon: "brain",
    subMenu: [
      { name: "Beyin Egzersizleri", link: "/beyin-egzersizleri" },
      { name: "Doğru Rengi Bul", link: "/beyin-egzersizleri/dogru-rengi-bul" },
      {
        name: "Doğru Kelmeyi Bil",
        link: "/beyin-egzersizleri/dogru-kelimeyi-bil",
      },
      {
        name: "Doğru Sayıyı Bul",
        link: "/beyin-egzersizleri/dogru-sayiyi-bul",
      },
    ],
    description:
      "Okuma egzersizlerindeki temel amaç göze hız kazandırmak, göz kaslarını güçlendirmek, gözün kelimeleri hızlı tanımasını sağlamak.Bu uygulamadan yeterince yararlanmak için her egzersizi 1. seviden 5. seviyeye kadar kademe kademe uygulayınız.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Kelime Egzersizleri",
    link: "/kelime-egzersizleri",
    icon: "text",
    subMenu: [
      { name: "Kelime Egzersizleri", link: "/kelime-egzersizleri" },
      { name: "Hızlı Görme", link: "/kelime-egzersizleri/hizli-gorme" },
      {
        name: "Göz Çevikliğini Arttırma",
        link: "/kelime-egzersizleri/goz-cevikligi-artirma",
      },
      {
        name: "Seviyenizi Yükseltin",
        link: "/kelime-egzersizleri/seviye-yukselt",
      },
      {
        name: "Gelişim Durumunuz",
        link: "/kelime-egzersizleri/seviye-gelisim",
      },
    ],
    description:
      "Hızlı Görme Uygulaması Takistoskop çalışmaları, gözün kelime veya kelime gruplarını 100ms ile 1000ms (1sn=1000ms) arasında bir hızla gösterip, gözünüzün görme hızını arttırır.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Metin Egzersizleri",
    link: "/metin-egzersizleri",
    icon: "book",
    subMenu: [
      {
        name: "Metin Egzersizleri",
        link: "/metin-egzersizleri",
      },
      {
        name: "Silinmeden Blok Okuma",
        link: "/metin-egzersizleri/silinmeden-okuma",
      },
      {
        name: "Silinerek Blok Okuma",
        link: "/metin-egzersizleri/silinerek-okuma",
      },
      {
        name: "Odaklı Blok Okuma",
        link: "/metin-egzersizleri/odakli-okuma",
      },
      {
        name: "Grup Okuma",
        link: "/metin-egzersizleri/grup-okuma",
      },
    ],
    description:
      "Takistoskop çalışmasının en büyük kazanımı kelimeleri grup halde algılaya bilmektir. Bu edindiğimiz beceriyi metinler üzerinde uygulayabilmek için bloklama egzersizleri yapmak gerekmektedir. Bu egzersiz, göze metin üzerinde sıçrama noktalarını öğreterek, gözün metin üzerinde seri bir şekilde akmasını sağlar.",
    youtubeId: "xiTK523Ot5U",
  },
  {
    name: "Okuma-Anlama Testleri",
    link: "/okuma-anlama-testleri",
    icon: "test",
    subMenu: [
      { name: "Okuma ve Anlama Testleri", link: "/okuma-anlama-testleri" },
      {
        name: "Hızlı Okuma Testi",
        link: "/okuma-anlama-testleri/hizli-okuma-testi",
      },
      {
        name: "Hızlı Okuma Gelişimi",
        link: "/okuma-anlama-testleri/hizli-okuma-testi-gelisim",
      },
      { name: "Anlama Testi", link: "/okuma-anlama-testleri/anlama-testi" },
      {
        name: "Anlama Gelişimi",
        link: "/okuma-anlama-testleri/anlama-testi-gelisim",
      },
    ],
    description: "Okuma ve Anlama Testleri",
    youtubeId: "",
  },
];
