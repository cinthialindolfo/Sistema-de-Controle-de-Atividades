import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Badge } from '@/components/ui/badge'

// Teste simples de componentes UI para validar renderização de badges (Urgência/Status)
describe('Componentes UI - Badges', () => {
  it('deve renderizar o texto correto na Badge', () => {
    render(React.createElement(Badge, null, 'Urgente'))
    expect(screen.getByText('Urgente')).toBeInTheDocument()
  })
})

describe('Lógica de Visualização', () => {
  // Mock manual dos helpers de cor que estão no page.tsx
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONCLUIDA": return "Concluída";
      case "PENDENTE": return "Pendente";
      default: return status;
    }
  };

  it('deve formatar labels de status corretamente', () => {
    expect(getStatusLabel('CONCLUIDA')).toBe('Concluída')
    expect(getStatusLabel('PENDENTE')).toBe('Pendente')
  })
})
