'use client'

import Image from "next/image";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { SetStateAction, useEffect, useState, ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface element {
  type: string;
  value: string;
  doubleIndent?: boolean;
}

interface section {
  title: string;
  elements: element[];
}

export default function Home() {
  const { slug } = useParams();

  const [s, setS] = useState<string>("");
  const [sections, setSections] = useState<section[]>([]);

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
  }, [slug]);

  const [meta, setMeta] = useState<{ title: string; description: string; image: string }>({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = s.match(frontmatterRegex);

    let title = "";
    let description = "";
    let image = "";

    let content = s;

    if (match) {
      const fm = match[1];
      title = fm.match(/title:\s*(.*)/)?.[1]?.trim() || "";
      description = fm.match(/description:\s*(.*)/)?.[1]?.trim() || "";
      image = fm.match(/image:\s*(.*)/)?.[1]?.trim() || "";
      content = s.replace(frontmatterRegex, "").trim();
    }

    setMeta({ title, description, image });

    const headerMatch = /# (.+)/g;
    const urlMatch = /<+([^|]+)\s*\|\s*(https?:\/\/[^>]+)>/g;
    const boldMatch = /\*\*(.*?)\*\*/g;
    const italicMatch = /\*(.*?)\*/g;
    const underscoreMatch = /__(.*?)__/g;
    const shinyMatch = /\$\$(.*?)\$\$/g;

    const sections: SetStateAction<section[]> = [];
    const headers = [...content.matchAll(headerMatch)];
    headers.forEach((header, index) => {
      const start = header.index! + header[0].length;
      const end = headers[index + 1]?.index || content.length;
      const sectionContent = content.slice(start, end).trim();

      const elements = sectionContent.split("\n").map((line) => {
        line = line.trim();
        if (!line) return null;
        if (line.startsWith("[")) {
          return { type: "image", value: line.slice(1, -1) || "" };
        }
        if (line.startsWith("-- ")) {
          return { type: "jotnote", value: line.slice(3) || "", doubleIndent: true };
        }
        if (line.startsWith("- ")) {
          return { type: "jotnote", value: line.slice(2) || "", doubleIndent: false };
        }
        if (urlMatch.test(line)) {
          const replacedLine = line.replace(urlMatch,
            (_, name, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${name.trim()}</a>`
          );
          return { type: "paragraph", value: replacedLine };
        }

        line = line
          .replace(boldMatch, "<b>$1</b>")
          .replace(italicMatch, "<i>$1</i>")
          .replace(underscoreMatch, "<u>$1</u>")
          .replace(shinyMatch, '<span class="shiny">$1</span>');

        return { type: "paragraph", value: line };
      }).filter((element): element is element => element !== null);

      sections.push({
        title: header[1],
        elements,
      });
    });

    setSections(sections);
  }, [s]);

  if (s === "404") {
    return (
      <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen">
        <h1 className="text-2xl font-bold">404</h1>
        <Link href="/" className="text-sm cursor-pointer border border-neutral-300 rounded-sm p-3 py-1 hover:shadow-sm transition-all duration-300">Home</Link>
      </div>
    )
  }

  if (!s || !meta.image) {
    return (
      <div>
        <div className="flex items-center justify-center w-screen h-screen">
          <LoaderCircle className="animate-spin text-neutral-500 w-8 h-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen p-12">
      <main className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="sm:text-4xl/8 text-3xl/8 font-bold">{meta.title}</h1>
            <p className="text-neutral-700 sm:text-base text-sm">{meta.description}</p>
          </div>
        </div>
        <div>
          <Image src={meta.image} unoptimized width={2048} height={1024} alt="title image" className="w-full aspect-video object-center object-cover rounded-sm border border-neutral-300" />
        </div>
        <div className="flex jusify-between w-full gap-12">
          <div className="sm:flex hidden flex-col gap-3 min-w-1/3 sticky self-start top-12">
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
                  {(() => {
                    const elements = section.elements;
                    const result: ReactNode[] = [];
                    let i = 0;
                    while (i < elements.length) {
                      const element = elements[i];
                      switch (element.type) {
                        case "image":
                          if (elements[i + 1]?.type === "image") {
                            result.push(
                              <div className="flex gap-4 my-4" key={`images-row-${index}-${i}`}>
                                <BlogImage key={`${index}-${i}`} src={element.value} />
                                <BlogImage key={`${index}-${i + 1}`} src={elements[i + 1].value} />
                              </div>
                            );
                            i += 2;
                          } else {
                            result.push(
                              <BlogImage key={`${index}-${i}`} src={element.value} />
                            );
                            i += 1;
                          }
                          break;
                        case "paragraph":
                          result.push(
                            <Paragraph key={`${index}-${i}`}>
                              <span dangerouslySetInnerHTML={{ __html: element.value }} />
                            </Paragraph>
                          );
                          i += 1;
                          break;
                        case "jotnote":
                          result.push(
                            <Jotnote key={`${index}-${i}`} doubleIndent={element.doubleIndent}>
                              {element.value}
                            </Jotnote>
                          );
                          i += 1;
                          break;
                        case "url":
                          result.push(
                            <span key={`${index}-${i}`} dangerouslySetInnerHTML={{ __html: element.value }} />
                          );
                          i += 1;
                          break;
                        default:
                          i += 1;
                          break;
                      }
                    }
                    return result;
                  })()}
                </Section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="w-screen absolute left-0 h-fit mt-16 bg-neutral-800 flex justify-evenly items-center p-8 rounded-t-3xl gap-4 text-neutral-100">
        <h1 className="font-semibold">Thanks for reading!</h1>
        <div className="flex flex-col gap-2 items-center justify-center w-fit">
          <h1 className="text-sm">See more of my stories</h1>
          <Link href="/" className='w-full items-center justify-center flex h-fit p-4 py-2 rounded-sm border border-neutral-300 cursor-pointer hover:bg-white hover:text-black transition-all duration-300'>
            <h2 className='font-semibold text-sm'>Home</h2>
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Category({ name }: { name: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById(`section-${name}`);
      if (!section) return setActive(false);

      const rect = section.getBoundingClientRect();
      setActive(rect.top <= 80 && rect.bottom > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [name]);

  return (
    <div
      className={`flex flex-col w-full gap-3 group hover:cursor-pointer ${active ? "font-bold text-black" : ""}`}
      onClick={() => {
        const section = document.getElementById(`section-${name}`);
        if (!section) return;
        const topOffset = section.getBoundingClientRect().top + window.scrollY - 12;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">{name}</h1>
        <ArrowRight className={`-translate-x-2 group-hover:translate-x-0 transition-transform duration-300 ${active ? "text-black" : ""}`} />
      </div>
      <div
        className={`h-[1.8px] transition-all duration-300 group-hover:w-full ${active ? "w-2/10" : "w-1/10"}`}
        style={{
          background: active ? "linear-gradient(to right, rgb(223, 115, 223), rgb(83, 83, 238))" : "black"
        }}
      ></div>
    </div>
  );
}

function Section({ title, children, id }: { title: string, children: ReactNode, id: string }) {
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

function Jotnote({ children, doubleIndent }: { children: ReactNode; doubleIndent?: boolean }) {
  return (
    <div className="flex items-start gap-2 ml-6">
      <div
        className={`w-1.5 h-1.5 flex-shrink-0 rounded-full mt-2 border ${doubleIndent ? "border-black ml-12" : "bg-black border-transparent"}`}
      ></div>
      <p className="text-sm text-neutral-700 flex-1">{children}</p>
    </div>
  );
}

function BlogImage({ src }: { src: string }) {
  return (
    <Image src={src} unoptimized width={2048} height={1024} alt="me" className="w-full aspect-video object-top object-cover rounded-sm border border-neutral-300 my-4" />
  )
}