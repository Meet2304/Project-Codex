'use client';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { HomeIcon, User, FolderGit2, Mail } from 'lucide-react';
import Link from 'next/link';

const data = [
  {
    title: 'Home',
    icon: (
      <HomeIcon className='h-full w-full text-neutral-300' />
    ),
    href: '/',
  },
  {
    title: 'About',
    icon: (
      <User className='h-full w-full text-neutral-300' />
    ),
    href: '/about',
  },
  {
    title: 'Projects',
    icon: (
      <FolderGit2 className='h-full w-full text-neutral-300' />
    ),
    href: '/projects',
  },
  {
    title: 'Contact',
    icon: (
      <Mail className='h-full w-full text-neutral-300' />
    ),
    href: '/contact',
  },
];

export function NavigationDock() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <Dock className="items-end pb-3 bg-zinc-900/80 border border-zinc-800 backdrop-blur-md rounded-2xl px-4">
        {data.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <DockItem
              className="aspect-square rounded-full bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/80 transition-colors cursor-pointer"
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
}
