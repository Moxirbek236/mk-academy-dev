import Link from 'next/link';

export const runtime = 'edge';

export default function NotFound() {
  return (
    <div className="min-h-screen-safe flex items-center justify-center px-6 text-center">
      <div className="max-w-md rounded-[32px] border border-gray-100 bg-white p-10 shadow-xl">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#2563eb]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
          Sahifa topilmadi
        </h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">
          Qidirayotgan sahifangiz mavjud emas yoki boshqa manzilga ko&apos;chirilgan.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-[20px] bg-[#2563eb] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#2563eb]/20 transition-transform active:scale-95"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
