"use client";

import React, { useEffect } from "react";

export default function FnWaterPage() {
  useEffect(() => {
    function setPageY() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      console.log(scrollPercent);
      document.documentElement.style.setProperty(
        "--page-y",
        scrollPercent + "%"
      );
    }
    window.addEventListener("scroll", setPageY, { passive: true });
    setPageY();
    return () => window.removeEventListener("scroll", setPageY);
  }, []);

  return (
    <main className="font-serif max-w-3xl mx-auto my-8 px-4 py-6 bg-white rounded-lg shadow-md">
      <div
        className="fixed left-0 top-0 h-[125vh] w-0 md:w-1/6 bg-[url(https://www.theregreview.org/wp-content/uploads/2019/02/GettyImages-904647396-4.33.40-PM.jpg)] bg-center saturate-25"
        style={{
          backgroundPositionY: `var(--page-y)`,
        }}
      ></div>
      <article>
        <div className="flex flex-col md:flex-row items-center mb-6 gap-6">
          <img
            src="https://images.theconversation.com/files/371162/original/file-20201124-13-113np.JPG?ixlib=rb-4.1.0&rect=0%2C431%2C2763%2C1381&q=45&auto=format&w=1356&h=668&fit=crop"
            alt="First Nations Water Crisis"
            className="w-full max-w-1/2 h-48 object-cover rounded-lg shadow"
          />
          <div className="flex flex-col items-end gap-2">
            <h1 className="text-4xl font-bold text-gray-900 md:ml-6 text-right">
              The Price of Gold: Canada’s Ongoing First Nations Water Crisis
            </h1>
            <div className="flex flex-col items-end text-right">
              <span className="text-gray-600 text-sm">
                Written by Jahvon Cockburn
                <br />
                Throughout January, 2026.
              </span>
              <span className="text-gray-500 text-xs">3 min read</span>
            </div>
          </div>
        </div>
        <section className="mb-8">
          <p className="text-base text-gray-700 mb-4">
            Many First Nations communities around Canada—a country with a
            significant percentage of the world’s freshwater reserves,
            romanticised as an endless source—see a significant irony every day.
            While urban communities outside of First Nations reserves have all
            the clean water they need, there are still{" "}
            <b>31 long term drinking water advisories</b> spanning through{" "}
            <b>29 reserves</b>, many of them existing for at least a quarter of
            a <b>century</b>. This isn’t simply a small failure with Canada’s
            system, but a violation of human rights in a country where this
            should logically <i>never</i> happen.
          </p>
        </section>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-800">
          Disclaimer
        </h2>
        <section className="mb-8">
          <p className="text-base text-gray-700">
            I am not of Indigenous descent and do not speak on behalf of
            any Indigenous community or individual. This article is written from a
            research perspective, and I have done my best to write with the aim of
            raising awareness and sharing information about the ongoing First Nations
            water crisis in Canada. For authentic voices and perspectives,
            please seek out Indigenous-led organizations and resources such as those
            in the sources I listed below.
          </p>
        </section>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-800">
          Broken Promises
        </h2>
        <section className="mb-8">
          <p className="mb-4 text-gray-700">
            After large promises made in 2016 by then-Prime Minister of Canada
            Justin Trudeau to lift all 186 drinking water advisories, there are
            still 31 outstanding—<i>10 years later</i>. It can be seen that
            through different years the government has made varying amounts of
            progress, some surpluses but also many deficits.
          </p>
          <div className="flex justify-center my-6 max-h-60">
            <img
              src="https://www.sac-isc.gc.ca/DAM/DAM-ISC-SAC/DAM-WTR/STAGING/images-images/water_advisory_look_bar_graph_1685626142727_eng.jpg"
              alt="Bar graph showing long-term drinking water advisories in effect on public systems on reserves by region"
              className="rounded-lg shadow max-w-full object-contain bg-no-repeat h-auto"
            />
          </div>
          <i>(Statistics Canada)</i>
          <p className="mb-4 text-gray-700">
            While this may seem like a small number, The Council of Canadians
            quotes that, “A single drinking water advisory can mean as many as
            5,000 people lack access to safe, clean drinking water.”{" "}
            <i>(Council of Canadians)</i>. This means that up to <b>155,000</b>{" "}
            Indigenous people lack access to a basic human right. To be able to
            drink or at all use their water, they must boil it for at least a
            minute, further waiting for it to cool.{" "}
            <i>(Indigenous Foundation)</i>. This is not only time consuming, but{" "}
            <b>expensive</b>, and just simply <i>not a justifiable reality</i>{" "}
            for many people.
          </p>
          <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 mb-4">
            One mother even discusses that she must, “sponge [her son with a
            skin disease] with bottled water from the jugs, clean him that way”,
            the only way she can safely take care of him.
          </blockquote>
          <p className="mb-2 text-gray-700">
            Others have to limit showers for both themselves and their children
            just to limit exposure to dangerous contaminants such as:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
            <li>
              Bacteria: Such as <b>E. coli</b> and coliform.
            </li>
            <li>
              Carcinogens: Including <b>Trihalomethanes</b>.
            </li>
            <li>
              Heavy Metals: Such as <b>uranium</b>.
            </li>
          </ul>
          <i>(Human Rights Watch)</i>
          <p className="text-gray-700">
            The daily reality for these residents is grueling. Simple acts like
            brushing teeth or bathing a child become high-risk activities.
          </p>
          <div className="flex justify-center my-6 h-80 outline-none">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1Z8r5mKxoTtWA0tbKdOcJn562kOPPRa8&ehbc=2E312F"
              className="rounded-lg shadow w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="First Nations Water Crisis Map"
            ></iframe>
          </div>
          <i>(Council of Canadians)</i>
        </section>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-800">
          Gaps in Funding and Training
        </h2>
        <section className="mb-8">
          <p className="mb-4 text-gray-700">
            When looking into the true causes behind these issues in First
            Nations communities, we can come to the conclusion on two main
            sources: gaps in funding and training. The Parliamentary Budget
            Officer identified deficits amounting to{" "}
            <b>$138 million per year</b> just for the <b>maintenance</b> and{" "}
            <b>operation</b> of basic water systems. However, money isn’t the
            only root of unclean water, there is a critical shortage of
            certified water professionals within First Nations communities. Only
            about 45% and 51% of 143 and 160 First Nations communities
            respectively in Ontario and British Columbia had water systems with
            a fully trained certified operator. <i>(Bharadwaj et al.)</i>
          </p>
          <p className="text-gray-700">
            This isn’t just a gap of will but a lack of support. Canadians have
            the resources to provide this essential service but rather choose
            not to supply it, leaving communities who need it the most to be
            lacking. Furthermore, the already existing certified operators admit
            issues in their job, being “understaffed, overworked and underpaid”
            <i>(Baijius and Patrick)</i>
          </p>
        </section>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-800">
          The Legacy of the Water Walker: Josephine Mandamin
        </h2>
        <section className="mb-8">
          <p className="mb-4 text-gray-700">
            Born Feb. 21, 1942, Josephine “Grandmother Water Walker” Mandamin
            was a prominent award winning Anishinabek figure. She is known best
            for her actions of raising awareness for water pollution and
            environmental degradation throughout indigenous reserves and great
            lakes.
          </p>
          <p className="mb-4 text-gray-700">
            At a conference in the year 2000, a friend of hers had a dream where
            water would cost the same as <b>gold</b> by the year 2030.
            <i>(Marshall)</i>. Refusing to let this dream become a reality,
            Mandamin committed herself to sharing her “nibi giikendaaswin”
            (water knowledge) in order to fight for the future and started a
            group of “Water Walkers”. <i>(Marshall)</i>. From 2003 to 2017,
            she—with her group—walked over <b>25,000 kilometers</b> around the
            Great Lakes to raise awareness about water pollution and Indigenous
            rights.
          </p>
          <p className="text-gray-700">
            Mandamin’s protest was somewhat successful, pressuring the
            government enough to lift 88 of the water advisories hurting
            Indigenous communities, though some are still outstanding.
            Throughout her lifetime, she received many awards including a name
            “Biidaasige-ba” (the one who comes with the light), a lifetime
            achievement award (2012), and the Governor General’s Meritorious
            Service Cross (2018). <i>(Museum of Toronto)</i>. Sadly, she passed
            away in 2019, but her legacy continues to live on and her
            great-neice—Autumn Peltier—, along with her daughter, following in
            her footsteps.
          </p>
        </section>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-800">
          Humans Right Violation as part of the United Nations
        </h2>
        <section>
          <p className="text-gray-700">
            The United Nations recognizes the access to safe water as a{" "}
            <b>basic human right</b>, and Canada—as a rich nation part of the
            UN—somehow still lacks this. The dangers of this are even more than
            just contaminants. During the COVID-19 pandemic, some communities
            like Neskantaga were forced to evacuate because of lack of effective
            infection control. <i>(Baijius and Patrick)</i>. The &quot;water
            crisis&quot; is not an invisible problem, it is a visible choice
            made through underfunding and systemic barriers. As we approach the
            year 2030—prophesied to have &quot;gold-priced water&quot;—the
            question remains: Will Canada finally honor its obligations to its
            original inhabitants, or will the taps stay dry and dirty?
          </p>
        </section>
        {/* Works Cited Section */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-blue-800">
          Works Cited
        </h2>
        <section>
          <ul className="list-none space-y-2 text-gray-700 text-sm">
            <li>
              City of Thunder Bay. “Grandmother Josephine Mandamin.”
              Www.thunderbay.ca, 29 Oct. 2019,{" "}
              <a
                href="https://www.thunderbay.ca/en/city-hall/grandmother-josephine-mandamin.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                www.thunderbay.ca/en/city-hall/grandmother-josephine-mandamin.aspx
              </a>
              . Accessed 15 Jan. 2026.
            </li>
            <li>
              Gallant, David Joseph. “Josephine Mandamin | the Canadian
              Encyclopedia.” Www.thecanadianencyclopedia.ca, 2 Oct. 2020,{" "}
              <a
                href="https://www.thecanadianencyclopedia.ca/en/article/josephine-mandamin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                www.thecanadianencyclopedia.ca/en/article/josephine-mandamin
              </a>
              . Accessed 11 Jan. 2026.
            </li>
            <li>
              Government of Canada. “Ending Long-Term Drinking Water
              Advisories.” Government of Canada, 25 Jan. 2024,{" "}
              <a
                href="https://www.sac-isc.gc.ca/eng/1506514143353/1533317130660"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                www.sac-isc.gc.ca/eng/1506514143353/1533317130660
              </a>
              .
            </li>
            <li>
              Kehinde, Mercy O, et al. “Weaving Knowledge Systems to Eradicate
              Drinking Water Crises in First Nations across Canada.” Journal of
              Water and Health, vol. 23, no. 9, 1 Sept. 2025, pp. 991–1003,{" "}
              <a
                href="https://iwaponline.com/jwh/article/23/9/991/109379/Weaving-knowledge-systems-to-eradicate-drinking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                iwaponline.com/jwh/article/23/9/991/109379/Weaving-knowledge-systems-to-eradicate-drinking
              </a>
              , https://doi.org/10.2166/wh.2025.346.
            </li>
            <li>
              Klasing, Amanda. “Make It Safe | Canada’s Obligation to End the
              First Nations Water Crisis.” Human Rights Watch, 7 June 2016,{" "}
              <a
                href="https://www.hrw.org/report/2016/06/07/make-it-safe/canadas-obligation-end-first-nations-water-crisis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                www.hrw.org/report/2016/06/07/make-it-safe/canadas-obligation-end-first-nations-water-crisis
              </a>
              .
            </li>
            <li>
              Murphy, Heather M, et al. “Insights and Opportunities: Challenges
              of Canadian First Nations Drinking Water Operators.” International
              Indigenous Policy Journal, vol. 6, no. 3, 18 June 2015,{" "}
              <a
                href="https://doi.org/10.18584/iipj.2015.6.3.7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://doi.org/10.18584/iipj.2015.6.3.7
              </a>
              .
            </li>
            <li>
              Museum of Toronto. “Josephine Mandamin - Museum of Toronto.”
              Museum of Toronto, 2 Apr. 2024,{" "}
              <a
                href="https://museumoftoronto.com/collection/josephine-mandamin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                museumoftoronto.com/collection/josephine-mandamin/
              </a>
              . Accessed 14 Jan. 2026.
            </li>
            <li>
              The Council of Canadians. “Safe Water for First Nations.” The
              Council of Canadians, 13 Nov. 2019,{" "}
              <a
                href="https://canadians.org/fn-water/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                canadians.org/fn-water/
              </a>
              .
            </li>
            <li>
              Yenilmez, Sena. “Indigenous Safe Drinking Water Crisis in Canada.”
              The Indigenous Foundation, 29 May 2025,{" "}
              <a
                href="https://www.theindigenousfoundation.org/articles/indigenous-safe-drinking-water-crisis-in-canada-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                www.theindigenousfoundation.org/articles/indigenous-safe-drinking-water-crisis-in-canada-overview
              </a>
              .
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
