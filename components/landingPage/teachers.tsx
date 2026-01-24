const teachers = [
  {
    name: "Mahmut Albey",
    title: "Hızlı Okuma Uzmanı",
    desc: "",
    image: "/images/teacher/person01.jpeg",
    city: "Istanbul",
    tel: "0212 000 00 00",
  },
  {
    name: "Ali  Güvenç",
    title: "Hızlı Okuma Uzmanı",
    desc: "",
    image: "/images/teacher/person02.jpeg",
    city: "Ankara",
    tel: "0212 000 00 00",
  },
  {
    name: "Dr. Yılmaz Mert",
    title: "Hızlı Okuma Uzmanı",
    desc: "",
    image: "/images/teacher/person03.jpeg",
    city: "Kayseri",
    tel: "0212 000 00 00",
  },
];

export default function Teachers() {
  return (
    <section className="py-20 bg-brand-tertiary-50" id="egitmenlerimiz">
      <div className="landing-container mx-auto px-6 ">
        <h2 className="text-3xl font-bold text-center">Eğitmenlerimiz</h2>

        <p className="max-w-2xl mx-auto text-center text-gray-700 text-lg mt-3">
          Alanında uzman eğitmenlerimiz, bilimsel tekniklerle süreci yakından
          takip eder ve öğrenme gelişiminizi adım adım destekler.
        </p>

        <div className="mt-10 flex mb-5 justify-center flex-wrap gap-4">
          {teachers.map((item) => (
            <div
              key={item.name}
              className="rounded-xl relative w-full overflow-hidden text-white sm:w-[300px] bg-center bg-no-repeat bg-cover aspect-[9/12] border border-brand-tertiary-50 hover:bg-brand-tertiary-100
               before:absolute
              before:top-0
              before:left-0
              before:w-full
              before:h-full
              before:bg-gradient-to-b before:from-transparent before:to-black/50 z-0
              "
              style={{ backgroundImage: `url('${item.image}')` }}
            >
              <div className="relative z-[1] overflow-hidden  w-full h-full flex flex-col justify-between">
                <div className="w-fit p-2 rounded-tl-xl text-white bg-brand-primary-150/60">
                  {item.title}
                </div>
                <div className="p-4">
                  <div>
                    {item.name} | {item.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
