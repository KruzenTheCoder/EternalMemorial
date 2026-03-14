import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-gold-50/20 to-background text-foreground overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-[-1] opacity-40">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between font-serif text-sm">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-600 to-gold-400 drop-shadow-sm">
            EternalMemory
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-8 font-sans leading-relaxed">
            A sanctuary to honor, remember, and cherish the lives of your loved ones with dignity and grace.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white font-medium px-8 shadow-lg shadow-gold-500/20 transition-all">
                Enter Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-md aspect-square lg:w-[500px] flex items-center justify-center">
           <div className="absolute inset-0 bg-gradient-radial from-gold-200/30 to-transparent blur-2xl rounded-full" />
           <div className="relative z-10 p-8 border border-gold-200 bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="space-y-4 text-center">
                <div className="w-16 h-16 mx-auto bg-gold-100 rounded-full flex items-center justify-center text-3xl">🕊️</div>
                <h3 className="font-display text-2xl font-semibold text-gold-800">Digital Tributes</h3>
                <p className="text-sm text-muted-foreground">Create lasting memorials with photos, stories, and virtual candles.</p>
             </div>
           </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
        {[
          { title: "Create Memorials", desc: "Build beautiful tribute pages.", icon: "🕯️" },
          { title: "Livestream Services", desc: "Broadcast services worldwide.", icon: "🎥" },
          { title: "Share Memories", desc: "Collect photos and stories.", icon: "❤️" },
        ].map((item, i) => (
          <div key={i} className="group relative p-8 rounded-2xl border border-gold-100 bg-white/60 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold font-display mb-2 text-gold-900">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      <footer className="absolute bottom-6 text-center text-xs text-muted-foreground font-sans">
        © {new Date().getFullYear()} Eternal Memory. All rights reserved.
      </footer>
    </main>
  );
}