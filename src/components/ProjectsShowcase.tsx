import { Search } from "lucide-react";

const projects = [
  { name: "Mara Conservancy", active: true },
  { name: "Mara Conservancy", active: false },
  { name: "Mara Conservancy", active: false },
  { name: "Mara Conservancy", active: false },
];

const ProjectsShowcase = () => {
  return (
    <div className="w-full max-w-md h-full flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {/* Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full rounded-xl bg-slate-800/60 px-4 py-3 pl-11 text-sm text-foreground placeholder:text-amber-400/50 border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-3 flex-1">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`flex-1 flex items-center rounded-xl px-5 border border-border/20 transition-all duration-300 cursor-pointer group ${
              project.active 
                ? "bg-slate-700/80" 
                : "bg-slate-800/60 hover:bg-slate-700/60 hover:scale-[1.02]"
            }`}
          >
            <span className={`font-medium transition-colors duration-300 ${
              project.active 
                ? "text-amber-400" 
                : "text-white group-hover:text-amber-400"
            }`}>
              {project.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsShowcase;
