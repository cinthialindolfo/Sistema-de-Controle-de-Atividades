import { describe, it, expect, vi } from 'vitest'

// 1. Mocks das dependências externas
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/headers', () => ({ 
  cookies: vi.fn(async () => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }))
}))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

// 2. Mock do DB
vi.mock('@/lib/db', () => ({
  isCloud: false,
  getDb: vi.fn(async () => ({
    prepare: vi.fn(() => ({
      run: vi.fn(() => ({ lastInsertRowid: 1 }))
    })),
    exec: vi.fn()
  }))
}))

describe('Validação Sênior - createActivityAction', () => {
  it('deve retornar erro se o título estiver vazio', async () => {
    const { createActivityAction } = await import('@/app/actions')
    const formData = new FormData()
    // Título faltando
    const result = await createActivityAction(formData)
    expect(result.success).toBe(false)
    expect(result.error).toBe('O título é obrigatório.')
  })

  it('deve retornar erro se a descrição estiver vazia', async () => {
    const { createActivityAction } = await import('@/app/actions')
    const formData = new FormData()
    formData.append('title', 'Atividade Teste')
    // Descrição faltando
    const result = await createActivityAction(formData)
    expect(result.success).toBe(false)
    expect(result.error).toBe('A descrição é obrigatória.')
  })

  it('deve retornar sucesso com todos os campos válidos', async () => {
    const { createActivityAction } = await import('@/app/actions')
    const formData = new FormData()
    formData.append('title', 'Nova Feature')
    formData.append('description', 'Desenvolvimento de módulo')
    formData.append('priority', 'ALTA')
    formData.append('category', 'FEATURE')
    formData.append('teamResponsible', 'Frontend')
    formData.append('personResponsible', 'Sênior Dev')

    const result = await createActivityAction(formData)
    expect(result.success).toBe(true)
  })
})
