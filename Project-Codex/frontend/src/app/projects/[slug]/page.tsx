import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomTabBar } from '@/components/BottomTabBar';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
          {/* Hero Media (Artifact-first) */}
          <div className="w-full aspect-video bg-foreground/5 mb-8" />

          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">
              Project: {slug}
            </h1>

            <p className="text-lg text-foreground/80 mb-8">
              A concise summary of what this project is and what it accomplishes.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold mb-4">
                Why it exists
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                The story behind this project: what problem it solves, what motivated its creation,
                and the principles that guided its development. Real content will come from the database.
              </p>
            </section>

            <div className="flex gap-2 mb-8">
              <span className="text-sm px-3 py-1 bg-foreground/10 rounded">
                Tag 1
              </span>
              <span className="text-sm px-3 py-1 bg-foreground/10 rounded">
                Tag 2
              </span>
            </div>

            <Link
              href="/projects"
              className="text-foreground/80 hover:text-foreground underline"
            >
              ← Back to projects
            </Link>
          </div>
        </main>

        <BottomTabBar />
      </div>
    </>
  );
}
