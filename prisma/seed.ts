import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  const user = await prisma.user.upsert({
    where: { name: "deneme" },
    update: {},
    create: {
      email: "deneme@example.com",
      password: hashedPassword,
      role: "ADMIN",
      name: "deneme",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "deneme1@example.com",
      password: hashedPassword,
      role: "STUDENT",
      name: "deneme1",
      Student: {
        create: {
          startDate: new Date(),
          endDate: new Date("2030-12-12"),
          level: "ILKOKUL",
        },
      },
    },
  });

  const article = await prisma.article.create({
    data: {
      title: "KÜÇÜK BAHÇİVANIN MACERASI",
      description:
        "Bir zamanlar, küçük bir köyde Elif adında sevimli bir kız yaşardı. Elif, doğayı çok sever ve her gün bahçede vakit geçirmekten büyük keyif alırdı. En büyük hayali, kendi bahçesinde rengarenk çiçekler açtırmaktı. Bir sabah, Elif erken kalktı. Hava güneşli ve kuşlar cıvıldıyordu. “Bugün bahçem için yeni tohumlar ekeceğim!” dedi heyecanla. Annesi ona bir torba tohum verdi. “Bunlar papatya, ayçiçeği ve lavanta tohumları,” dedi. Elif, tohumları dikkatlice inceledi ve bahçeye doğru koştu. Bahçeye vardığında, toprak yumuşaktı ve hafif nemliydi. Elif, ellerini yıkadıktan sonra küçük bir kürekle toprağı kazmaya başladı. Tohumları sırasıyla toprağa ekti ve üzerlerini örttü. Ardından, sulama kabını aldı ve bitkilerin üzerine nazikçe su serpti. Elif, her gün sabah erken kalkıp bahçesine gidiyor, bitkilerine sevgiyle bakıyordu. Güneşin sıcak ışıkları altında toprak iyice ısınırken, küçük tohumlar yavaş yavaş filizlenmeye başladı. Elif’in yüzünde büyük bir mutluluk vardı. Günler geçtikçe, papatyalar beyaz yapraklarını açtı, ayçiçekleri güneşe doğru uzandı ve lavantalar hoş kokularıyla bahçeyi doldurdu. Komşular bile Elif’in bahçesinin güzelliğine hayran kaldı. Bir gün, Elif bahçede oyun oynarken küçük bir kuşun yaralandığını gördü. Kuşun kanadı hafifçe kırılmıştı. Elif hemen kuşu nazikçe aldı ve evine götürdü. Annesiyle birlikte kuşun yarasını sardılar ve ona iyi bakmaya başladılar. Haftalar sonra, kuş iyileşti ve özgürlüğüne kavuştu. Elif onu son kez sevgiyle okşadı ve kuş da hafifçe ötüp uçtu gitti. Elif, doğaya yardım etmenin ve onunla ilgilenmenin ne kadar önemli olduğunu bir kez daha anlamıştı. O günden sonra, Elif sadece bahçesine değil, etrafındaki tüm canlılara da daha çok sevgi ve ilgi göstermeye başladı. Arkadaşlarına da bunu anlattı ve birlikte doğayı korumanın yollarını öğrendiler. Elif’in küçük bahçesi, sadece bitkilerin değil, dostluğun ve sevginin de büyüdüğü bir yer olmuştu. O, her gün bahçesinde yeni bir şeyler keşfederek mutlu yaşamaya devam etti.",
      level: "ILKOKUL",
      tests: [
        {
          id: "1",
          question: "Hikâyedeki kızın adı nedir?",
          answer: "a",
          options: [
            { id: "a", text: "Elif" },
            { id: "b", text: "Ayşe" },
            { id: "c", text: "Zeynep" },
            { id: "d", text: "Fatma" },
          ],
        },
        {
          id: "2",
          question: "Elif en çok neyi seviyordu?",
          answer: "b",
          options: [
            { id: "a", text: "Resim yapmayı" },
            { id: "b", text: "Doğayı" },
            { id: "c", text: "Oyun oynamayı" },
            { id: "d", text: "Şeker yemeyi" },
          ],
        },
        {
          id: "3",
          question: "Elif bahçesine hangi tohumları ekti?",
          answer: "c",
          options: [
            { id: "a", text: "Gül, lale, orkide" },
            { id: "b", text: "Elma, armut, kiraz" },
            { id: "c", text: "Papatya, ayçiçeği, lavanta" },
            { id: "d", text: "Buğday, arpa, mısır" },
          ],
        },
        {
          id: "4",
          question: "Elif tohumları ektikten sonra ne yaptı?",
          answer: "b",
          options: [
            { id: "a", text: "Oyun oynadı" },
            { id: "b", text: "Tohumları suladı" },
            { id: "c", text: "Uyudu" },
            { id: "d", text: "Kitap okudu" },
          ],
        },
        {
          id: "5",
          question: "Bitkiler büyüdüğünde ayçiçekleri ne yaptı?",
          answer: "d",
          options: [
            { id: "a", text: "Yapraklarını döktü" },
            { id: "b", text: "Kokusu yayıldı" },
            { id: "c", text: "Soldu" },
            { id: "d", text: "Güneşe doğru uzandı" },
          ],
        },
        {
          id: "6",
          question: "Elif bahçede ne buldu?",
          answer: "c",
          options: [
            { id: "a", text: "Bir köpek" },
            { id: "b", text: "Bir kedi" },
            { id: "c", text: "Yaralı bir kuş" },
            { id: "d", text: "Bir kaplumbağa" },
          ],
        },
        {
          id: "7",
          question: "Elif kuşu gördüğünde ne yaptı?",
          answer: "a",
          options: [
            { id: "a", text: "Onu evine götürdü" },
            { id: "b", text: "Bahçede bıraktı" },
            { id: "c", text: "Uçurmayı denedi" },
            { id: "d", text: "Arkadaşına verdi" },
          ],
        },
        {
          id: "8",
          question: "Kuş iyileştikten sonra ne oldu?",
          answer: "b",
          options: [
            { id: "a", text: "Bahçede kaldı" },
            { id: "b", text: "Uçup gitti" },
            { id: "c", text: "Elif'e hediye getirdi" },
            { id: "d", text: "Yeniden yaralandı" },
          ],
        },
        {
          id: "9",
          question: "Elif kuşa yardım ettikten sonra neyi anladı?",
          answer: "c",
          options: [
            { id: "a", text: "Bahçeyle ilgilenmenin zor olduğunu" },
            { id: "b", text: "Çiçekleri sevmediğini" },
            { id: "c", text: "Doğaya yardım etmenin önemli olduğunu" },
            { id: "d", text: "Kuşların uçamadığını" },
          ],
        },
        {
          id: "10",
          question: "Elif’in bahçesi neyin büyüdüğü bir yer oldu?",
          answer: "d",
          options: [
            { id: "a", text: "Sadece papatyaların" },
            { id: "b", text: "Sadece oyunların" },
            { id: "c", text: "Sadece hayvanların" },
            { id: "d", text: "Dostluğun ve sevginin" },
          ],
        },
      ],
    },
  });

  console.log({ user, student, article });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
