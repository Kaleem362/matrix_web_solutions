export default function Services() {
  const services = [
    {
      title: "Web Development",
      desc: "Custom MERN websites with stunning UI & Performance."
    },
    {
      title: "Business Websites",
      desc: "Corporate & Professional websites fully responsive."
    },
    {
      title: "Web Applications",
      desc: "Dashboards, Portals, Systems using Mongo + Node."
    }
  ];

  return (
    <div className="py-20">
      <h2 className="text-4xl font-bold text-center">
        Our <span className="text-green-400">Services</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10 px-6">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-gray-900 bg-opacity-60 p-6 rounded-xl border border-gray-700 hover:border-green-400 transition"
          >
            <h3 className="text-2xl text-green-400 font-semibold">
              {s.title}
            </h3>
            <p className="mt-2 text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
