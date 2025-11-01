// src/app/(app)/dashboard/page.tsx
import type { Metadata } from 'next'
import { LayoutDashboard, Users, TrendingUp, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard | EustacheApp',
  description: 'Vue d\'ensemble de votre tableau de bord',
}

const stats = [
  {
    name: 'Total des utilisateurs',
    value: '2,651',
    change: '+4.75%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    name: 'Revenus',
    value: '€54,312',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    name: 'Croissance',
    value: '23.8%',
    change: '+2.1%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center space-x-3">
        <LayoutDashboard className="h-8 w-8 text-primary-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Vue d'ensemble de vos données et métriques importantes
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-gray-800 px-6 py-6 shadow ring-1 ring-gray-700"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-400" aria-hidden="true" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-400">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm">
                        <span
                          className={`font-semibold ${
                            stat.changeType === 'positive'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="ml-1 text-gray-400">vs mois dernier</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Graphique fictif */}
        <div className="rounded-lg bg-gray-800 p-6 shadow ring-1 ring-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Activité récente
          </h3>
          <div className="h-64 bg-gray-700 rounded-md flex items-center justify-center">
            <p className="text-gray-400">Graphique de données (mock)</p>
          </div>
        </div>

        {/* Liste d'activités */}
        <div className="rounded-lg bg-gray-800 p-6 shadow ring-1 ring-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Dernières actions
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Nouvel utilisateur inscrit', time: 'Il y a 2 min' },
              { action: 'Commande traitée', time: 'Il y a 5 min' },
              { action: 'Rapport généré', time: 'Il y a 12 min' },
              { action: 'Mise à jour système', time: 'Il y a 1h' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-white">{item.action}</span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}