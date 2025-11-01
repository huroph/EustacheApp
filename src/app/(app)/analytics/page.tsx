// src/app/(app)/analytics/page.tsx
import type { Metadata } from 'next'
import { BarChart2, PieChart, Activity, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analytics | EustacheApp',
  description: 'Analysez vos données et performances',
}

const analyticsCards = [
  {
    title: 'Vues de page',
    value: '45,321',
    change: '+8.2%',
    period: '7 derniers jours',
    icon: Activity,
    color: 'blue',
  },
  {
    title: 'Taux de conversion',
    value: '3.4%',
    change: '+0.5%',
    period: 'ce mois',
    icon: Target,
    color: 'green',
  },
  {
    title: 'Sessions',
    value: '12,543',
    change: '-2.1%',
    period: '7 derniers jours',
    icon: PieChart,
    color: 'purple',
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center space-x-3">
        <BarChart2 className="h-8 w-8 text-primary-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">
            Analysez vos performances et découvrez des insights
          </p>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {analyticsCards.map((card) => {
          const Icon = card.icon
          const isPositive = card.change.startsWith('+')
          
          return (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-lg bg-gray-800 px-6 py-6 shadow ring-1 ring-gray-700"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 bg-gray-700`}>
                    <Icon className={`h-6 w-6 text-${card.color}-400`} />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-400">
                      {card.title}
                    </dt>
                    <dd className="mt-1">
                      <div className="text-2xl font-semibold text-white">
                        {card.value}
                      </div>
                      <div className="flex items-center text-sm">
                        <span
                          className={`font-medium ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {card.change}
                        </span>
                        <span className="ml-1 text-gray-400">{card.period}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Graphique en aires */}
        <div className="rounded-lg bg-gray-800 p-6 shadow ring-1 ring-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">
              Évolution du trafic
            </h3>
            <select className="text-sm bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-1">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
              <option>3 derniers mois</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center">
            <p className="text-gray-400">Graphique d'évolution du trafic (mock)</p>
          </div>
        </div>

        {/* Top pages */}
        <div className="rounded-lg bg-gray-800 p-6 shadow ring-1 ring-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Pages les plus visitées
          </h3>
          <div className="space-y-4">
            {[
              { page: '/dashboard', views: '8,432', percentage: '28%' },
              { page: '/analytics', views: '5,234', percentage: '18%' },
              { page: '/settings', views: '3,891', percentage: '13%' },
              { page: '/profile', views: '2,156', percentage: '7%' },
              { page: '/help', views: '1,879', percentage: '6%' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {item.page}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">{item.views} vues</span>
                  <span className="text-sm font-medium text-primary-400">
                    {item.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="rounded-lg bg-gray-800 p-6 shadow ring-1 ring-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">
          Insights et recommandations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-800">
            <h4 className="font-medium text-blue-300 mb-2">📈 Croissance positive</h4>
            <p className="text-sm text-blue-200">
              Votre trafic a augmenté de 8.2% cette semaine. Continuez sur cette lancée !
            </p>
          </div>
          <div className="p-4 bg-yellow-900/50 rounded-lg border border-yellow-800">
            <h4 className="font-medium text-yellow-300 mb-2">⚠️ Attention</h4>
            <p className="text-sm text-yellow-200">
              Les sessions ont diminué de 2.1%. Analysez les causes possibles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}