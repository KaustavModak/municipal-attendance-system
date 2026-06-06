export default function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      className="
      bg-[#1B2730]
      border
      border-[#2A3942]
      rounded-2xl
      p-5
      shadow-lg

      hover:border-[#00A884]
      hover:shadow-[0_0_20px_rgba(0,168,132,0.15)]
      hover:-translate-y-1

      transition-all
      duration-300
      cursor-pointer
      "
    >
      <p
        className="
        text-[#8696A0]
        text-lg
        "
      >
        {title}
      </p>

      <h2
        className="
        text-white
        text-5xl
        font-bold
        mt-3
        "
      >
        {value}
      </h2>
    </div>
  );
}