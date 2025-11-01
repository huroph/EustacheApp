// src/app/(app)/projects/page.tsx
import type { Metadata } from 'next'
import { projects } from '@/mock/data'
import ProjectCard from '@/components/projects/ProjectCard'

export const metadata: Metadata = {
  title: 'Projects | EustacheApp',
  description: 'Liste des projets par année',
}

export default function ProjectsPage() {
  // Group projects by year
  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = []
    }
    acc[project.year].push(project)
    return acc
  }, {} as Record<number, typeof projects>)

  const years = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => b - a) // descending order

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {years.map((year) => (
        <section key={year} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-white">{year}</h2>
            <span className="text-gray-400">{projectsByYear[year].length} projets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projectsByYear[year].map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination dots (visual only) */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(4)].map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-white' : 'bg-white/30'
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}