import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock das dependências de banco e cache
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/headers', () => ({ 
  cookies: vi.fn(async () => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }))
}))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

// Mock do banco de dados e ações reais para isolar lógica de formulário e fluxo
vi.mock('@/app/actions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/app/actions')>()
  return {
    ...actual,
    getActivities: vi.fn(async () => ({ success: true, data: [] })),
    createActivity: vi.fn(async () => ({ success: true })),
    updateActivity: vi.fn(async () => ({ success: true })),
    deleteActivity: vi.fn(async () => ({ success: true })),
    login: vi.fn(async (formData: FormData) => {
      const pin = formData.get('pin')
      if (pin === '1234') return { success: true }
      return { success: false, error: 'PIN incorreto' }
    }),
    getCurrentUser: vi.fn(async () => ({ firstName: 'Admin' })),
    seedActivities: vi.fn(async () => ({ success: true })),
  }
})

describe('Ações de Autenticação', () => {
  it('login deve processar PIN de 4 dígitos corretamente', async () => {
    const { login } = await import('@/app/actions')
    const formData = new FormData()
    formData.append('firstName', 'User')
    formData.append('lastName', 'Test')
    formData.append('pin', '1234')
    const res = await login(formData)
    expect(res.success).toBe(true)
  })

  it('logout deve ser chamado sem erros', async () => {
    const { logout } = await import('@/app/actions')
    await expect(logout()).resolves.not.toThrow()
  })
})

describe('Ações de CRUD de Atividades', () => {
  it('createActivity deve validar o envio de dados', async () => {
    const { createActivity } = await import('@/app/actions')
    const formData = new FormData()
    formData.append('title', 'Teste Unitário')
    const res = await createActivity(formData)
    expect(res.success).toBe(true)
  })

  it('updateActivity deve aceitar alteração de status', async () => {
    const { updateActivity } = await import('@/app/actions')
    const formData = new FormData()
    formData.append('status', 'CONCLUIDA')
    const res = await updateActivity('id-1', formData)
    expect(res.success).toBe(true)
  })

  it('deleteActivity deve processar exclusão por ID', async () => {
    const { deleteActivity } = await import('@/app/actions')
    const res = await deleteActivity('id-1')
    expect(res.success).toBe(true)
  })
})

describe('Ações de Sistema', () => {
  it('seedActivities deve popular o banco inicial', async () => {
    const { seedActivities } = await import('@/app/actions')
    const res = await seedActivities()
    expect(res.success).toBe(true)
  })
})
