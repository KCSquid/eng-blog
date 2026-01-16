"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface pageData {
  description: string;
  homeSection: string;
  slug: string;
  title: string;
}

export default function Home() {
  const [pages, setPages] = useState<pageData[]>([]);

  useEffect(() => {
    async function get() {
      const res = await fetch("/api/getPages");
      if (!res.ok) return;

      setPages(await res.json());
    }

    get();
  }, []);
  console.log(pages);

  return (
    <div className="flex w-screen h-screen items-center justify-center lg:px-32 px-12">
      <main className="flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="font-bold text-2xl text-center">
            Welcome to my Blog!
          </h1>
          <h1 className="font-medium text-base text-neutral-700 text-center">
            This will be mostly filled with school project pages.
          </h1>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="font-bold text-2xl">Pages</h1>
          <div className="flex gap-4 flex-wrap items-stretch justify-center h-fit">
            <Link
              href="/fn-water"
              className="w-fit max-w-80 p-4 py-4 rounded-sm border border-blue-300 cursor-pointer hover:shadow-md transition-all duration-300 bg-blue-50"
            >
              <h2 className="font-semibold text-sm text-blue-900">
                The Price of Gold: Canada’s Ongoing First Nations Water Crisis
                <span className="text-neutral-500"> - English</span>
              </h2>
              <h3 className="font-semibold text-[12px] text-neutral-700">
                An in-depth look at the ongoing water crisis affecting First
                Nations communities in Canada.
              </h3>
            </Link>
            {pages.map((page: pageData) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="w-fit max-w-80 p-4 py-4 rounded-sm border border-neutral-300 cursor-pointer hover:shadow-sm transition-all duration-300"
              >
                <h2 className="font-semibold text-sm">
                  {page.title}{" "}
                  <span className="text-neutral-500">
                    {page.homeSection ? ` - ${page.homeSection}` : ""}
                  </span>
                </h2>
                <h3 className="font-semibold text-[12px] text-neutral-700">
                  {page.description}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
