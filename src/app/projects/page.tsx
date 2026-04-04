const projects = [
  {
    name: "PropTrack",
    status: "Active",
    description:
      "Property management platform that simplifies tracking tenants, leases, and maintenance across your portfolio.",
    tags: ["SaaS", "Real Estate", "Full-Stack"],
    link: "#",
  },
  {
    name: "TheStrat",
    status: "In Development",
    description:
      "Trading strategy toolkit bringing institutional-level analysis to retail traders.",
    tags: ["FinTech", "Trading", "Data"],
    link: "#",
  },
  {
    name: "Salesforce Solutions",
    status: "Ongoing",
    description:
      "Custom Salesforce builds, automations, and integrations for enterprise clients.",
    tags: ["Salesforce", "Enterprise", "Consulting"],
    link: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-12 py-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Things I&apos;m building, shipping, and scaling.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <div
            key={project.name}
            className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold">{project.name}</h2>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
                {project.status}
              </span>
            </div>
            <p className="mb-4 text-text-secondary">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-background px-2.5 py-1 text-xs text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
