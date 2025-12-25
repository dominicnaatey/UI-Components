import NeoCarousel from "@/components/neo-carousel2/NeoCarousel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 bg-white">
      <div className="z-10  w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-black">Neo Robotics Showcase</h1>
        <NeoCarousel />
      </div>
    </main>
  );
}
