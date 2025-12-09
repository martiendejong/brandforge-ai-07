import { Search } from "lucide-react";

const projects = [
  { name: "Mara Conservancy", highlighted: false },
  { name: "Mara Conservancy", highlighted: false },
  { name: "Mara Conservancy", highlighted: true },
  { name: "Mara Conservancy", highlighted: true },
];

const ProjectsShowcase = () => {
  return (
    <div className="w-full max-w-md h-full flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {/* Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full rounded-xl bg-slate-800/60 px-4 py-3 pl-11 text-sm text-foreground placeholder:text-muted-foreground border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
          readOnly
        />
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-3 flex-1">
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex-1 flex items-center rounded-xl bg-slate-800/60 px-5 border border-border/20 hover:bg-slate-700/60 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <span className={project.highlighted ? "text-amber-400 font-medium" : "text-foreground font-medium"}>
              {project.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsShowcase;
