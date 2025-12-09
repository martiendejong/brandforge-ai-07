import { useState } from "react";
import { Search } from "lucide-react";

const allProjects = [
  { name: "Mara Conservancy", active: true },
  { name: "Mara Conservancy", active: false },
  { name: "Mara Conservancy", active: false },
  { name: "Mara Conservancy", active: false },
];

const ProjectsShowcase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(allProjects);
    } else {
      const filtered = allProjects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-md h-full flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {/* Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl bg-slate-800/60 px-4 py-3 pl-11 text-sm text-foreground placeholder:text-amber-400/50 border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleSearch}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          aria-label="Search projects"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-3 flex-1">
        {filteredProjects.map((project, index) => (
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
