// src/components/projects/ProjectCard.tsx
import Link from 'next/link'
import React from 'react'
import Badge from '@/components/ui/Badge'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    pdf: string
    dates: string
    badge: string
    imageAlt?: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg bg-white/5 p-4 shadow-sm ring-1 ring-white/5">
      <div className="h-40 w-full overflow-hidden rounded-md bg-gray-800" aria-hidden>
        {/* placeholder image */}
        <div className="h-full w-full bg-[url('/placeholder-project.jpg')] bg-cover bg-center opacity-90" />
      </div>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
          <p className="text-sm text-gray-300 mt-1">{project.pdf}</p>
          <p className="text-xs text-gray-400 mt-1">{project.dates}</p>
        </div>
        <div className="ml-3 flex items-start">
          <Badge>{project.badge}</Badge>
        </div>
      </div>

      <Link href={`/projects/${project.id}`} className="absolute inset-0" aria-label={`Voir ${project.title}`} />
    </article>
  )
}
