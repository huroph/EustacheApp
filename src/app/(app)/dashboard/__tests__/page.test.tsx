// src/app/(app)/dashboard/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import DashboardPage from '../page'

describe('Dashboard Page', () => {
  it('renders the dashboard title', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('renders statistics cards', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Total des utilisateurs')).toBeInTheDocument()
    expect(screen.getByText('2,651')).toBeInTheDocument()
    expect(screen.getByText('Revenus')).toBeInTheDocument()
    expect(screen.getByText('€54,312')).toBeInTheDocument()
  })

  it('renders activity section', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Activité récente')).toBeInTheDocument()
    expect(screen.getByText('Dernières actions')).toBeInTheDocument()
  })

  it('renders mock data correctly', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Nouvel utilisateur inscrit')).toBeInTheDocument()
    expect(screen.getByText('Il y a 2 min')).toBeInTheDocument()
  })
})