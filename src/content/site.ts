export const site = {
  name: "Paardhiv Sarakam",
  role: "Software Engineer",
  location: "India",
  email: "paardhiv01@gmail.com",
  resumeHref: "/resume.pdf",
  // Carried over from the pre-rebuild paardhiv.com, where these lived as
  // window.location assignments in script.js rather than as hrefs.
  social: {
    github: "https://github.com/Paardhiv10",
    linkedin: "https://in.linkedin.com/in/paardhiv-sarakam-05b8aa204",
    twitter: "https://x.com/PaardhivS",
  },
  hero: {
    eyebrow: "Software Engineer — building since forever",
    headline: "I build things that work, and read well.",
    bio: "I'm a software engineer who's spent the last few years inside YC-backed and early-stage startups — writing code, shipping product, and occasionally solving a Rubik's Cube faster than you can read this sentence.",
    tag: "Currently: Software Developer at GPI India, shipping CAD tooling.",
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
  projects: [
    {
      id: "speedcubing",
      title: "CubeCoast",
      type: "Booking Platform",
      description:
        "A platform for browsing speedcubing courses and booking 1:1 coaching sessions — built after years of teaching cubing myself and feeling every bit of friction in the old way of doing it.",
      color: "canary",
      rotate: -2,
    },
    {
      id: "parking",
      title: "Smart Campus Parking",
      type: "Web App",
      description:
        "Browse open spots, reserve a slot, get walking directions — a small system that made finding parking on campus a non-event instead of a daily headache.",
      color: "aqua",
      rotate: 1.5,
    },
    {
      id: "bionics",
      title: "Surgical Bionics Catalog",
      type: "Product Catalog",
      description:
        "A product and information platform for a surgical equipment distributor — built to make a dense technical catalog easy to browse and easy to quote from.",
      color: "orange",
      rotate: -1,
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
    },
    {
      id: "skylark",
      title: "Skylark Drones",
      type: "Case Study",
      description:
        "A go-to-market read on expanding into Australia — market conditions, who they'd be up against, and the sequence I'd bet on.",
      color: "orange",
      rotate: -1.5,
    },
    {
      id: "porter",
      title: "Porter",
      type: "Case Study",
      description:
        "Pulled apart customer lifetime value to find where retention leaked, and proposed the levers most likely to move it.",
      color: "canary",
      rotate: 2,
    },
  ],
  experience: [
    {
      company: "GPI India",
      logo: "/logos/gpi.png",
      role: "Software Developer",
      dates: "Jan 2024 — Present",
      impact: "Building TankDesign's 3D-CAD model generation, spec, and quotation tooling.",
    },
    {
      company: "Mailmodo",
      logo: "/logos/mailmodo.png",
      role: "Product Management Intern",
      dates: "Jun 2023 — Jan 2024",
      impact: "Shipped AMP email form blocks and automation journeys; streamlined integrations via PRDs.",
    },
    {
      company: "Troopod",
      logo: "/logos/troopod.png",
      role: "Product Strategy Intern",
      dates: "Dec 2022 — Feb 2023",
      impact: "Wrote product strategy docs off primary and secondary market research.",
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
      impact: "Built responsive marketing sites with HTML5, CSS3, Bootstrap, and JS.",
    },
    {
      company: "Glue Labs",
      logo: "/logos/gluelabs.png",
      role: "Content & Community Leader",
      dates: "Dec 2021 — Mar 2022",
      impact: "Hosted 7+ startup webinars, grew and ran a 40+ member community.",
    },
  ],
  experienceNote:
    "The people, leaders, and orgs who believed I'd fit the bill — usually before I'd proved it.",
  education: {
    // TODO(paardhiv): replace with your real degree/major/years —
    // this is a placeholder, not a guessed credential.
    degree: "REPLACE_ME — degree, major & years",
    university: "Manipal Institute of Technology, MAHE",
    por: [
      {
        org: "Hult Prize, MAHE",
        role: "Head of Corporate Relations",
        dates: "Sep 2022 — Mar 2023",
      },
      {
        org: "E-Cell, MIT Manipal",
        role: "Startup Development Executive",
        dates: "Aug 2021 — Oct 2022",
      },
    ],
  },
  footer: {
    line: "Solved cubes, shipped products, still looking for the next scramble.",
  },
} as const;
