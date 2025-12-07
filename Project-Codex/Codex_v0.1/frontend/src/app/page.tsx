import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomTabBar } from '@/components/BottomTabBar';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/50 backdrop-blur-sm border-b border-foreground/10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-montserrat font-bold">Project Codex</h1>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-16 pb-20 md:pb-8">
          {/* Introduction Section */}
          <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-montserrat font-bold mb-6">
                Welcome to the Codex
              </h2>
              <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
                A minimal, thoughtful space where ideas meet execution.
                Explore the principles that guide my work and the projects that bring them to life.
              </p>
              <Link
                href="/about"
                className="inline-block px-8 py-3 bg-foreground text-background rounded-md font-montserrat font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-foreground/50"
              >
                Learn About Me
              </Link>
            </div>
          </section>

          {/* Ideals Section */}
          <section className="container mx-auto px-4 py-16 bg-foreground/5 -mx-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-center">
                My Ideals
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-background/50 rounded-lg">
                  <h4 className="text-xl font-montserrat font-semibold mb-3">Simplicity</h4>
                  <p className="text-foreground/80">
                    Clarity in design and purpose. Every element serves a function.
                  </p>
                </div>
                <div className="p-6 bg-background/50 rounded-lg">
                  <h4 className="text-xl font-montserrat font-semibold mb-3">Craft</h4>
                  <p className="text-foreground/80">
                    Attention to detail and quality in execution, always.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/ideals"
                  className="text-foreground/80 hover:text-foreground underline"
                >
                  View all ideals →
                </Link>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-center">
                Featured Projects
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border border-foreground/10 rounded-lg overflow-hidden hover:border-foreground/30 transition-colors">
                  <div className="aspect-video bg-foreground/5" />
                  <div className="p-6">
                    <h4 className="text-xl font-montserrat font-semibold mb-2">Sample Project</h4>
                    <p className="text-foreground/80 mb-4">
                      A brief description of the project and its purpose.
                    </p>
                    <Link
                      href="/projects/sample"
                      className="text-sm text-foreground/80 hover:text-foreground underline"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Link
                  href="/projects"
                  className="text-foreground/80 hover:text-foreground underline"
                >
                  View all projects →
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomTabBar />
      </div>
    </>
  );
}
