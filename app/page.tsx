import { HomeImmersiveRoot } from "@/components/immersive/home-immersive-root";
import { HomeHeroClient } from "@/components/home/home-hero-client";
import { HomeSections } from "@/components/home/home-sections";

export default function Home() {
  return (
    <HomeImmersiveRoot>
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-foreground overflow-x-hidden">
        <HomeHeroClient />
        <HomeSections />
      </main>
    </HomeImmersiveRoot>
  );
}
