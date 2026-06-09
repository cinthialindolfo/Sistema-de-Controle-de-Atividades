import { describe, it, expect, vi } from 'vitest'

// 1. Mock das dependências externas (Next.js)
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/headers', () => ({ 
  cookies: vi.fn(async () => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }))
}))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

// 2. Mock do Banco de Dados (lib/db.ts) para evitar carregar better-sqlite3 nos testes
vi.mock('@/lib/db', () => ({
  isCloud: false,
  getDb: vi.fn(async () => ({
    prepare: vi.fn(() => ({
      get: vi.fn(() => ({ id: '1', firstName: 'Admin', pin: '1234' })),
      all: vi.fn(() => []),
      run: vi.fn(() => ({ lastInsertRowid: 1 }))
    })),
    exec: vi.fn()
  }))
}))

// 3. Testes da Lógica Real
describe('Ações de Autenticação - Lógica Real', () => {
  it('deve validar login com sucesso', async () => {
    // Importamos a action real
    const { login } = await import('@/app/actions')
    
    const formData = new FormData()
    formData.append('firstName', 'Admin')
    formData.append('lastName', 'User')
    formData.append('pin', '1234')
    
    const result = await login(formData)
    expect(result.success).toBe(true)
  })

  it('deve falhar se o PIN for curto', async () => {
    const { login } = await import('@/app/actions')
    const formData = new FormData()
    formData.append('pin', '12')
    
    const result = await login(formData)
    expect(result.success).toBe(false)
    expect(result.error).toContain('PIN')
  })
})

describe('CRUD de Atividades - Lógica Real', () => {
  it('deve disparar criação de atividade', async () => {
    const { createActivity } = await import('@/app/actions')
    const formData = new FormData()
    formData.append('title', 'Teste')
    formData.append('priority', 'ALTA')
    
    const result = await createActivity(formData)
    expect(result.success).toBe(true)
  })
})
