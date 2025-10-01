import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomTabBar } from '@/components/BottomTabBar';

export default function ProjectsPage() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/50 backdrop-blur-sm border-b border-foreground/10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-montserrat font-bold">
              Project Codex
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 pt-16 pb-20 md:pb-8">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-8">
              Projects
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Project cards will be populated from Supabase */}
              <div className="border border-foreground/10 rounded-lg overflow-hidden hover:border-foreground/30 transition-colors">
                <div className="aspect-video bg-foreground/5" />
                <div className="p-6">
                  <h2 className="text-xl font-montserrat font-semibold mb-2">
                    Sample Project
                  </h2>
                  <p className="text-foreground/80 text-sm mb-4">
                    A placeholder project card. Real data will come from the database.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-foreground/10 rounded">
                      Tag
                    </span>
                  </div>
                  <Link
                    href="/projects/sample"
                    className="text-sm text-foreground/80 hover:text-foreground underline"
                  >
                    View project →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <BottomTabBar />
      </div>
    </>
  );
}
