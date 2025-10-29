"use client";

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

  const [sourceUrls, setSourceUrls] = useState<string[]>([]);
  const [sourceTitles, setSourceTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/pages/${slug}.md`);
      if (res.status === 404) {
        setS("404");
        return;
      }
      const text = await res.text();
      setS(text);
    };

    fetchData();
  }, [slug]);

  const [meta, setMeta] = useState<{
    title: string;
    description: string;
    image: string;
  }>({
    title: "",
    description: "",
    image: "",
  });

  const [duoStreak, setDuoStreak] = useState<number>(0);

  useEffect(() => {
    const startTimestamp = 1651896000000;
    const now = Date.now();
    const days = Math.floor((now - startTimestamp) / (1000 * 60 * 60 * 24));
    setDuoStreak(days + 1);
  }, []);

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

    const headerMatch = /^# (.+)$/gm;
    const urlRegex = /<\s*([^|>]+)\s*\|\s*([^>]+)>/g;
    const boldMatch = /\*\*(.*?)\*\*/g;
    const italicMatch = /(^|[^*])\*(?!\*)(.*?)\*(?!\*)/g;
    const underscoreMatch = /__(.*?)__/g;
    const shinyMatch = /\$\$(.*?)\$\$/g;
    const braceUrlRegex = /\{(https?:\/\/[^}\s]+)\}/g;

    const urlToIndex = new Map<string, number>();
    const orderedUrls: string[] = [];

    const formatInline = (raw: string) => {
      return raw
        .replace(urlRegex, (_m, name, url) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${name.trim()}</a>`;
        })
        .replace(braceUrlRegex, (_m, url) => {
          if (!urlToIndex.has(url)) {
            urlToIndex.set(url, urlToIndex.size + 1);
            orderedUrls.push(url);
          }
          const idx = urlToIndex.get(url)!;
          return `<sup class="inline-source shiny" data-src="${url}" data-idx="${idx}">[${idx}]</sup>`;
        })
        .replace(boldMatch, "<b>$1</b>")
        .replace(italicMatch, "$1<i>$2</i>")
        .replace(underscoreMatch, "<u>$1</u>")
        .replace(shinyMatch, '<span class="shiny">$1</span>');
    };

    const sections: SetStateAction<section[]> = [];
    const headers = [...content.matchAll(headerMatch)];
    headers.forEach((header, index) => {
      const start = header.index! + header[0].length;
      const end = headers[index + 1]?.index || content.length;
      const sectionContent = content.slice(start, end).trim();

      const elements = sectionContent
        .split("\n")
        .map((line) => {
          line = line.trim().replace("[DUO STREAK]", duoStreak.toString());
          if (!line) return null;
          if (line.startsWith("[")) {
            return { type: "image", value: line.slice(1, -1) || "" };
          }
          if (line.startsWith("-- ")) {
            const raw = line.slice(3) || "";
            return {
              type: "jotnote",
              value: formatInline(raw),
              doubleIndent: true,
            };
          }
          if (line.startsWith("- ")) {
            const raw = line.slice(2) || "";
            return {
              type: "jotnote",
              value: formatInline(raw),
              doubleIndent: false,
            };
          }
          if (line.startsWith("## ")) {
            return {
              type: "title",
              value: line.slice(3) || "",
            };
          }

          return { type: "paragraph", value: formatInline(line) };
        })
        .filter((element): element is element => element !== null);

      sections.push({
        title: header[1],
        elements,
      });
    });

    setSections(sections);
    setSourceUrls(orderedUrls);
    setSourceTitles({});
  }, [s, duoStreak]);

  useEffect(() => {
    if (!sourceUrls.length) return;
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/fetchtitles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: sourceUrls }),
        });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (!mounted) return;
        setSourceTitles(data.titles || {});
      } catch {
        const fallback: Record<string, string> = {};
        sourceUrls.forEach((u) => (fallback[u] = u));
        if (mounted) setSourceTitles(fallback);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sourceUrls]);

  useEffect(() => {
    if (!sourceUrls.length) return;

    let tooltip = document.getElementById(
      "inline-source-tooltip"
    ) as HTMLDivElement | null;
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "inline-source-tooltip";
      tooltip.style.position = "fixed";
      tooltip.style.padding = "6px 10px";
      tooltip.style.background = "rgba(18,18,18,0.95)";
      tooltip.style.color = "white";
      tooltip.style.borderRadius = "6px";
      tooltip.style.fontSize = "12px";
      tooltip.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
      tooltip.style.pointerEvents = "none";
      tooltip.style.zIndex = "9999";
      tooltip.style.transform = "translate(-50%, -8px)";
      tooltip.style.transition = "opacity 120ms ease, transform 120ms ease";
      tooltip.style.opacity = "0";
      document.body.appendChild(tooltip);

      const style = document.createElement("style");
      style.id = "inline-source-tooltip-styles";
      style.textContent = `
        .inline-source { cursor: pointer; user-select: none; }
        .inline-source:hover { text-decoration: underline; }
      `;
      document.head.appendChild(style);
    }

    const onMouseEnter = (ev: MouseEvent) => {
      const target = ev.currentTarget as HTMLElement;
      const url = target.getAttribute("data-src") || "";
      const idx = target.getAttribute("data-idx") || "";
      const title = (sourceTitles && sourceTitles[url]) || url;
      if (!tooltip) return;
      tooltip.innerHTML = `<div style="font-weight:600;margin-bottom:4px">[${idx}] ${escapeHtml(
        title
      )}</div><div style="opacity:0.9;font-size:11px;color:#ddd">${escapeHtml(
        url
      )}</div>`;
      tooltip.style.opacity = "1";
      const rect = target.getBoundingClientRect();
      const left = rect.left + rect.width / 2;
      tooltip.style.left = `${left}px`;
      const ttRect = tooltip.getBoundingClientRect();
      const topPos = rect.top - ttRect.height - 10;
      tooltip.style.top = `${topPos}px`;
      tooltip.style.transform = "translate(-50%, 0)";
    };

    const onMouseMove = (ev: MouseEvent) => {
      const target = ev.currentTarget as HTMLElement;
      if (!tooltip) return;
      const rect = target.getBoundingClientRect();
      const left = rect.left + rect.width / 2;
      const topPos = rect.top - tooltip.getBoundingClientRect().height - 10;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${topPos}px`;
    };

    const onMouseLeave = () => {
      if (!tooltip) return;
      tooltip.style.opacity = "0";
    };

    const onClick = (ev: MouseEvent) => {
      const target = ev.currentTarget as HTMLElement;
      const url = target.getAttribute("data-src");
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    };

    const nodes = Array.from(
      document.querySelectorAll(".inline-source")
    ) as HTMLElement[];
    nodes.forEach((n) => {
      n.addEventListener("mouseenter", onMouseEnter);
      n.addEventListener("mousemove", onMouseMove);
      n.addEventListener("mouseleave", onMouseLeave);
      n.addEventListener("click", onClick);
    });

    return () => {
      nodes.forEach((n) => {
        n.removeEventListener("mouseenter", onMouseEnter);
        n.removeEventListener("mousemove", onMouseMove);
        n.removeEventListener("mouseleave", onMouseLeave);
        n.removeEventListener("click", onClick);
      });
    };
  }, [sections, sourceTitles, sourceUrls]);

  if (s === "404") {
    return (
      <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen">
        <h1 className="text-2xl font-bold">404</h1>
        <Link
          href="/"
          className="text-sm cursor-pointer border border-neutral-300 rounded-sm p-3 py-1 hover:shadow-sm transition-all duration-300"
        >
          Home
        </Link>
      </div>
    );
  }

  if (!s || !meta.image) {
    return (
      <div>
        <div className="flex items-center justify-center w-screen h-screen">
          <LoaderCircle className="animate-spin text-neutral-500 w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full lg:p-16 p-12">
      <main className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="sm:text-4xl/8 text-3xl/8 font-bold">{meta.title}</h1>
            <p className="text-neutral-700 sm:text-base text-sm">
              {meta.description}
            </p>
          </div>
        </div>
        <div>
          <Image
            src={meta.image}
            unoptimized
            width={1920}
            height={1080}
            alt="title image"
            className="w-full aspect-video object-center object-cover rounded-sm border border-neutral-300"
          />
        </div>
        <div className="flex jusify-between w-full gap-12">
          <div className="sm:flex hidden flex-col gap-3 min-w-1/3 sticky self-start top-12">
            <div className="flex gap-2 items-center mb-4">
              <Image
                src="/pfp.jpg"
                width={64}
                height={64}
                alt="me"
                className="rounded-full w-8"
              />
              <p className="italic text-sm">By Jahvon Cockburn</p>
            </div>
            {sections.map((section, index) => (
              <Category name={section.title} key={`Category-Index-${index}`} />
            ))}
          </div>
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-4">
              {sections.map((section, index) => (
                <Section
                  title={section.title}
                  key={section.title}
                  id={`section-${section.title}`}
                >
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
                              <div
                                className="flex sm:flex-row flex-col gap-4 my-4"
                                key={`images-row-${index}-${i}`}
                              >
                                <BlogImage
                                  key={`${index}-${i}`}
                                  src={element.value}
                                  double
                                />
                                <BlogImage
                                  key={`${index}-${i + 1}`}
                                  src={elements[i + 1].value}
                                  double
                                />
                              </div>
                            );
                            i += 2;
                          } else {
                            result.push(
                              <BlogImage
                                key={`${index}-${i}`}
                                src={element.value}
                              />
                            );
                            i += 1;
                          }
                          break;
                        case "paragraph":
                          result.push(
                            <Paragraph key={`${index}-${i}`}>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: element.value,
                                }}
                              />
                            </Paragraph>
                          );
                          i += 1;
                          break;
                        case "jotnote":
                          result.push(
                            <Jotnote
                              key={`${index}-${i}`}
                              doubleIndent={element.doubleIndent}
                            >
                              {element.value}
                            </Jotnote>
                          );
                          i += 1;
                          break;
                        case "title":
                          result.push(
                            <Title
                              key={`${index}-${i}`}
                              title={element.value}
                            />
                          );
                          i += 1;
                          break;
                        case "url":
                          result.push(
                            <span
                              key={`${index}-${i}`}
                              dangerouslySetInnerHTML={{
                                __html: element.value,
                              }}
                            />
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
      <footer className="w-full absolute left-0 h-fit mt-16 bg-neutral-800 flex justify-evenly items-center p-8 rounded-t-3xl gap-4 text-neutral-100">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-semibold">Thanks for reading!</h1>
          <button
            className="text-sm cursor-pointer text-neutral-400"
            onClick={() =>
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              })
            }
          >
            Back to top?
          </button>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center w-fit">
          <h1 className="text-sm">See more of my stories</h1>
          <Link
            href="/"
            className="w-full items-center justify-center flex h-fit p-4 py-2 rounded-sm border border-neutral-300 cursor-pointer hover:bg-white hover:text-black transition-all duration-300"
          >
            <h2 className="font-semibold text-sm">Home</h2>
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
      setActive(rect.top <= 350 && rect.bottom >= 350 - 16);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [name]);

  return (
    <div
      className={`flex flex-col w-full gap-3 group hover:cursor-pointer ${
        active ? "font-bold text-black" : ""
      }`}
      onClick={() => {
        const section = document.getElementById(`section-${name}`);
        if (!section) return;
        const topOffset =
          section.getBoundingClientRect().top + window.scrollY - 12;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">{name}</h1>
        <ArrowRight
          className={`-translate-x-2 group-hover:translate-x-0 transition-transform duration-300 ${
            active ? "text-black" : ""
          }`}
        />
      </div>
      <div
        className={`h-0.5 transition-[width] duration-300 ease group-hover:w-full ${
          active ? "w-2/10 min-w-15" : "w-1/10 min-w-10"
        }`}
        style={{
          background: active
            ? "linear-gradient(to right, rgb(223, 115, 223), rgb(83, 83, 238))"
            : "black",
        }}
      ></div>
    </div>
  );
}

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-2" id={id}>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-base text-neutral-700">{children}</p>;
}

function Title({ title }: { title: string }) {
  return (
    <h2 className="text-lg text-neutral-950 font-medium leading-0 mt-1 mb-3">
      {title}
    </h2>
  );
}

function Jotnote({
  children,
  doubleIndent,
}: {
  children: ReactNode;
  doubleIndent?: boolean;
}) {
  const content =
    typeof children === "string" ? (
      <span dangerouslySetInnerHTML={{ __html: children }} />
    ) : (
      children
    );

  return (
    <div className="flex items-start gap-2 ml-6">
      <div
        className={`w-1.5 h-1.5 flex-shrink-0 rounded-full mt-2 border ${
          doubleIndent ? "border-black ml-12" : "bg-black border-transparent"
        }`}
      ></div>
      <p className="text-sm text-neutral-700 flex-1">{content}</p>
    </div>
  );
}

function BlogImage({ src, double }: { src: string; double?: boolean }) {
  return (
    <Image
      src={src}
      unoptimized
      width={1920}
      height={1080}
      alt="me"
      className={`${
        double ? "sm:w-1/2 w-full" : "w-full my-4"
      } aspect-video object-top object-cover rounded-sm border border-neutral-300`}
    />
  );
}
function escapeHtml(rawTitle: string): string {
  return rawTitle
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
