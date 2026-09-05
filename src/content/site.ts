export const site = {
  name: "Paardhiv Sarakam",
  role: "Software Engineer",
  location: "India",
  email: "paardhiv01@gmail.com",
  // External now, so the nav opens it in a new tab rather than navigating away.
  // `?usp=sharing` is stripped — it is Drive's share-source marker, not needed
  // to view the file.
  resumeHref:
    "https://drive.google.com/file/d/1IErAfhFTDkvlHoApfqy5gtW1L3Ez1BMu/view",
  // Carried over from the pre-rebuild paardhiv.com, where these lived as
  // window.location assignments in script.js rather than as hrefs.
  social: {
    github: "https://github.com/Paardhiv10",
    linkedin: "https://in.linkedin.com/in/paardhiv-sarakam-05b8aa204",
    twitter: "https://x.com/PaardhivS",
  },
  hero: {
    // The greeting is the whole heading now — the full name still lives in
    // `name` for metadata and the JSON-LD.
    greeting: "Hi, I'm Paardhiv",
    bio: [
      "I like building things from 0→1 — the kind that make complicated problems feel simple. I start with a messy problem, work out how people actually experience it, and turn it into something useful.",
      "That means staying with it end to end — the first question, the rough idea, the technical calls, the build, and the day someone actually uses it. The point of all of it is to make something people want.",
      "Most curious about AI, product, and the place where technology meets real problems. I learn by building — blank page, figure it out, then keep finding ways to make it better.",
    ],
    // Phrases lifted out of `bio` and given an accent underline. Everything
    // else stays one size in one font, so the emphasis is a few words rather
    // than a change of typeface. Each must appear verbatim above.
    highlights: ["0→1", "make something people want", "AI", "product"],
  },
  algorithm: {
    intro: "To achieve the Impact",
    venn: [
      { label: "Shape", rest: "the product" },
      { label: "Ship", rest: "the product" },
      { label: "Sync", rest: "the people" },
    ],
    groups: [
      {
        title: "Product",
        highlight: "Strategy",
        skills: ["Roadmapping", "PRDs", "A/B Testing", "Go-to-Market Strategy"],
      },
      {
        title: "Product",
        highlight: "Design",
        skills: ["User Stories", "User Flows", "Wireframes", "Persona Writing"],
      },
      {
        title: "Market and User",
        highlight: "Research",
        skills: [
          "Primary & Secondary Market Analysis",
          "Competitor Analysis",
          "Usability Testing",
        ],
      },
      {
        title: "Analytics and",
        highlight: "Programming",
        skills: [
          "JavaScript",
          "Python",
          "SQL",
          "HTML / CSS",
          "APIs",
          "Firebase",
          "Google Analytics",
          "Mixpanel",
        ],
      },
    ],
  },
  // `metric` is the headline number inked large on the note. Leave it null when
  // there isn't a real figure to show — the note simply renders without one
  // rather than carrying a made-up stat. `url` works the same way: a note with
  // one peels off and opens it, a note with null stays put.
  projects: [
    {
      id: "wca-extension",
      title: "WCA Extension",
      type: "Chrome Extension",
      description:
        "Finding your next cube competition meant digging through the official site. Now it's one click, with filters and instant alerts — kept by cubers in 32 countries at 87% retention and a 5/5 rating.",
      color: "aqua",
      rotate: -1.5,
      metric: { value: "630+", label: "installs" },
      url: "https://chromewebstore.google.com/detail/wca-competitions-tracker/gecaloboiggfhbpbmegpeflkcochbljn",
    },
    {
      id: "speedcubing",
      title: "CubeCoast",
      type: "Education Platform",
      description:
        "A speedcubing platform where cubers browse courses and book 1:1 coaching. I built it after years of teaching cubing myself, and feeling every bit of the friction in the old way of doing it. 300+ students taught and mentored.",
      color: "canary",
      rotate: -2,
      metric: { value: "$3K+", label: "revenue" },
      url: "https://cubecoast.com",
    },
    {
      id: "parking",
      title: "Smart Campus Parking",
      type: "Web App",
      description:
        "Browse open spots, reserve a slot, get walking directions — a small system that made finding parking on campus a non-event instead of a daily headache.",
      color: "aqua",
      rotate: 1.5,
      metric: null,
      url: null,
    },
    {
      id: "bionics",
      title: "Surgical Bionics Catalog",
      type: "Product Catalog",
      description:
        "A product and information platform for a surgical equipment distributor — built to make a dense technical catalog easy to browse and easy to quote from.",
      color: "orange",
      rotate: -1,
      metric: null,
      url: null,
    },
    // second row — the case studies from the old portfolio
    {
      id: "furrl",
      title: "Furrl",
      type: "Case Study",
      description:
        "Dug into where Furrl's e-commerce traffic actually came from, sized it against competitors, and wrote up what I'd change to convert more of it.",
      color: "aqua",
      rotate: 1.5,
      metric: null,
      url: null,
    },
    {
      id: "skylark",
      title: "Skylark Drones",
      type: "Case Study",
      description:
        "A go-to-market read on expanding into Australia — market conditions, who they'd be up against, and the sequence I'd bet on.",
      color: "orange",
      rotate: -1.5,
      metric: null,
      url: null,
    },
    {
      id: "porter",
      title: "Porter",
      type: "Case Study",
      description:
        "Pulled apart customer lifetime value to find where retention leaked, and proposed the levers most likely to move it.",
      color: "canary",
      rotate: 2,
      metric: null,
      url: null,
    },
  ],
  experience: [
    {
      company: "GPI India",
      logo: "/logos/gpi.png",
      role: "Software Developer",
      dates: "Jan 2024 — Present",
      impact:
        "Building TankDesign's 3D-CAD model generation, spec, and quotation tooling.",
    },
    {
      company: "Mailmodo (YC S21)",
      logo: "/logos/mailmodo.png",
      role: "Product Management Intern",
      dates: "Jun 2023 — Jan 2024",
      impact:
        "Shipped AMP email form blocks and automation journeys; streamlined integrations via PRDs.",
    },
    {
      company: "Troopod",
      logo: "/logos/troopod.png",
      role: "Product Strategy Intern",
      dates: "Dec 2022 — Feb 2023",
      impact:
        "Wrote product strategy docs off primary and secondary market research.",
    },
    {
      company: "Qkrishi",
      logo: "/logos/qkrishi.png",
      role: "Product Dev & Management Intern",
      dates: "Sep 2022 — Mar 2023",
      impact: "Led LMS integration for a quantum-computing learning platform.",
    },
    {
      company: "Fluentgrid",
      logo: "/logos/fluentgrid.png",
      role: "Summer Intern",
      dates: "Jun 2022 — Jul 2022",
      impact:
        "Built responsive marketing sites with HTML5, CSS3, Bootstrap, and JS.",
    },
    {
      company: "Glue Labs",
      logo: "/logos/gluelabs.png",
      role: "Content & Community Leader",
      dates: "Dec 2021 — Mar 2022",
      impact:
        "Hosted 7+ startup webinars, grew and ran a 40+ member community.",
    },
  ],
  experienceNote:
    "The people, leaders, and orgs who believed I'd fit the bill — usually before I'd proved it.",
  education: {
    por: [
      {
        org: "Hult Prize, MAHE",
        role: "Head of Corporate Relations",
        dates: "Sep 2022 — Mar 2023",
        bullets: [
          "Led a chapter of 15+ members to organize the largest social entrepreneurship competition on campus.",
          "Built strategic partnerships, secured sponsorships, and onboarded 5 judges and 2 speakers to provide guidance and mentorship for participating teams.",
        ],
        // The phrase inside `bullets` that carries the photos: it gets
        // underlined, and hovering it is what fans them out. Must appear
        // verbatim in one of the bullets above or nothing is marked up.
        highlight: "the largest social entrepreneurship competition",
        // Real chapter photos, resized from assets/source/education/.
        images: [
          "/education/hult/1.jpg",
          "/education/hult/2.jpg",
          "/education/hult/3.jpg",
        ],
      },
      {
        org: "E-Cell, MIT Manipal",
        role: "Startup Development Executive",
        dates: "Aug 2021 — Oct 2022",
        bullets: [
          "Worked as a Startup Development Executive to inculcate the spirit of entrepreneurship within the student community through greater awareness.",
          "Helped over 10+ student startups in validating their ideas.",
          "Collaborated with other executives of different domains and managed complex projects from start to finish.",
        ],
        highlight: "student community",
        images: [
          "/education/ecell/1.jpg",
          "/education/ecell/2.jpg",
          "/education/ecell/3.jpg",
        ],
      },
    ],
  },
  footer: {
    line: "Solved cubes, shipped products, still looking for the next scramble.",
  },
} as const;
