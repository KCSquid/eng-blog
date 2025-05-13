'use client'

import Image from "next/image";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { SetStateAction, useEffect, useState, ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { slug } = useParams();

  const [s, setS] = useState<string>("");
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/pages/${slug}.md`);
      if (res.status === 404) {
        setS("404");
        return;
      };
      const text = await res.text();
      setS(text);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const headerMatch = /# (.+)/g;
    const boldMatch = /\*\*(.*?)\*\*/g;
    const italicMatch = /\*(.*?)\*/g;
    const underscoreMatch = /__(.*?)__/g;
    const shinyMatch = /\$\$(.*?)\$\$/g;

    const sections: SetStateAction<any[]> = [];
    const headers = [...s.matchAll(headerMatch)];
    headers.forEach((header, index) => {
      const start = header.index! + header[0].length;
      const end = headers[index + 1]?.index || s.length;
      const content = s.slice(start, end).trim();

      const elements = content.split("\n").map((line) => {
        line = line.trim();
        if (!line) return null;
        if (line.startsWith("[")) {
          return { type: "image", value: line.slice(1, -1) || "" };
        }
        if (line.startsWith("- ")) {
          return { type: "jotnote", value: line.slice(2) || "" };
        }

        line = line
          .replace(boldMatch, "<b>$1</b>")
          .replace(italicMatch, "<i>$1</i>")
          .replace(underscoreMatch, "<u>$1</u>")
          .replace(shinyMatch, '<span class="shiny">$1</span>');

        return { type: "paragraph", value: line };
      }).filter(Boolean);

      sections.push({
        title: header[1],
        elements,
      });
    });

    setSections(sections);
  }, [s]);

  if (!s) {
    return (
      <div>
        <div className="flex items-center justify-center w-screen h-screen">
          <LoaderCircle className="animate-spin text-neutral-500 w-8 h-8" />
        </div>
      </div>
    )
  }

  if (s === "404") {
    return (
      <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen">
        <h1 className="text-2xl font-bold">404</h1>
        <Link href="/" className="text-sm cursor-pointer border border-neutral-300 rounded-sm p-3 py-1 hover:shadow-sm transition-all duration-300">Home</Link>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen p-12">
      <main className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl/8 font-bold">The Marrow Thieves</h1>
            <p className="text-neutral-700 text-base">A gripping tale of survival and resilience in a dystopian world.</p>
          </div>
        </div>
        <div>
          <Image src="https://hachette.imgix.net/books/9781913090012.jpg?auto=compress&w=2048&h=1024&fit=crop&fm=jpg" unoptimized width={2048} height={1024} alt="title image" className="w-full aspect-video object-top object-cover rounded-sm border border-neutral-300" />
        </div>
        <div className="flex jusify-between w-full gap-12">
          <div className="flex flex-col gap-3 min-w-1/3 sticky self-start top-12">
            <div className="flex gap-2 items-center mb-4">
              <Image src="/pfp.jpg" width={64} height={64} alt="me" className="rounded-full w-8" />
              <p className="italic text-sm">By Jahvon Cockburn</p>
            </div>
            {sections.map((section, index) => (
              <Category name={section.title} key={`Category-Index-${index}`} />
            ))}
          </div>
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-4">
              {sections.map((section, index) => (
                <Section title={section.title} key={section.title} id={`section-${section.title}`}>
                  {section.elements.map((element: { type: string; value: string }, subIndex: number) => (
                    element.type === "paragraph" ?
                      <Paragraph key={`${index} + ${subIndex}`}><span dangerouslySetInnerHTML={{ __html: element.value }} /></Paragraph> :

                      element.type === "jotnote" ?
                        <Jotnote key={`${index} + ${subIndex}`}>{element.value}</Jotnote> :

                        <BlogImage key={`${index} + ${subIndex}`} src={element.value} />
                  ))}
                </Section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full h-12"></footer>
    </div>
  );
}

function Category({ name }: { name: string; }) {
  return (
    <div className="flex flex-col w-full gap-3 group hover:cursor-pointer" onClick={() => {
      const section = document.getElementById(`section-${name}`);
      if (!section) return;
      const topOffset = section.getBoundingClientRect().top + window.scrollY - 12;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }}>
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">{name}</h1>
        <ArrowRight className="-translate-x-2 group-hover:translate-x-0 transition-transform duration-300" />
      </div>
      <div className="w-[10%] h-[1.5px] bg-black group-hover:w-full transition-all duration-300"></div>
    </div>
  )
}

function Section({ title, children, id }: { title: string, children: any, id: string }) {
  return (
    <div className="flex flex-col gap-2" id={id}>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

function Paragraph({ children }: { children: ReactNode; }) {
  return (
    <p className="text-base text-neutral-700">{children}</p>
  )
}

function Jotnote({ children }: { children: ReactNode; }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-2 h-2 flex-shrink-0 rounded-full bg-black mt-2"></div>
      <p className="text-base text-neutral-700 flex-1">{children}</p>
    </div>
  );
}

function BlogImage({ src }: { src: string }) {
  return (
    <Image src={src} unoptimized width={2048} height={1024} alt="me" className="w-full aspect-video object-top object-cover rounded-sm border border-neutral-300 my-4" />
  )
}