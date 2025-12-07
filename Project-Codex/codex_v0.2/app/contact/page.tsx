import { NavigationDock } from '@/components/NavigationDock';

export default function ContactPage() {
  return (
    <main className="min-h-screen text-white bg-zinc-950 flex flex-col items-center justify-center p-8 relative">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Contact</h1>
      <p className="text-zinc-400 max-w-2xl text-center">
        This is the contact page. Content coming soon.
      </p>
      <NavigationDock />
    </main>
  );
}
