'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [pages, setPages] = useState<string[]>([])

  useEffect(() => {
    async function get() {
      const res = await fetch('/api/getPages');
      if (!res.ok) return;

      const dirtyPages = await res.json();
      const cleanPages = dirtyPages.map((p: string) =>
        p
          .replace(/^\/?pages\//, '')
          .replace(/\.md$/, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );

      setPages(cleanPages);
    }

    get();
  }, []);

  const dirty = (clean: string) => {
    return clean
      .toLowerCase()
      .split(' ')
      .join('-');
  }

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <main className="flex flex-col gap-8 items-center justify-center">
        <div className='flex flex-col gap-2 items-center justify-center'>
          <h1 className='font-bold text-2xl'>Welcome to my Blog!</h1>
          <h1 className='font-medium text-base text-neutral-700'>This will be mostly filled with school project pages.</h1>
        </div>
        <div className='flex flex-col gap-4 items-center justify-center'>
          <h1 className='font-bold text-2xl'>Pages</h1>
          <div className='flex gap-4'>
            {pages.map((page, index) => (
              <Link key={`${page} + ${index}`} href={`/${dirty(page)}`} className='w-fit h-fit p-4 py-2 rounded-sm border border-neutral-300 cursor-pointer hover:shadow-sm transition-all duration-300'>
                <h2 className='font-semibold text-sm'>{page}</h2>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}