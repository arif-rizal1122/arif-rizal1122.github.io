import React, { useState } from 'react';

const ProjectCard = ({ project }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex w-full">
      <div className="w-full bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl shadow-blue-500/5 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group">
        <div className="relative h-48 overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt={project.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10">
              <i className={`${project.icon || 'fas fa-code'} text-6xl text-gray-300 group-hover:text-blue-500 transition-colors`}></i>
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-3 dark:text-white line-clamp-1">{project.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span key={index} className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between">
            {project.demoUrl ? (
              <a href={project.demoUrl} className="text-blue-600 font-bold text-sm hover:underline">
                View Live Demo &rarr;
              </a>
            ) : project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" className="text-gray-900 dark:text-white font-bold text-sm hover:text-blue-600 transition-colors flex items-center">
                <i className="fab fa-github mr-2 text-lg"></i> Code
              </a>
            ) : <span className="text-xs font-bold text-gray-400 italic">Private Project</span>}
            
            <button 
              className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              title="More Details"
            >
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
