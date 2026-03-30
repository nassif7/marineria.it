import React from 'react'
import renderer, { act } from 'react-test-renderer'

// ---------------------------------------------------------------------------
// Module mocks — must be declared before any imports that reference them
// ---------------------------------------------------------------------------

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
  useSegments: () => [],
}))

jest.mock('@/api/auth', () => ({
  signIn: jest.fn(),
}))

// ---------------------------------------------------------------------------

import * as SecureStore from 'expo-secure-store'
import { signIn as apiSignIn } from '@/api/auth'
import SessionProvider, { useSession } from '../SessionProvider'
import { TUserRole } from '@/api/types'

const mockGetItem = SecureStore.getItemAsync as jest.Mock
const mockSetItem = SecureStore.setItemAsync as jest.Mock
const mockDeleteItem = SecureStore.deleteItemAsync as jest.Mock
const mockApiSignIn = apiSignIn as jest.Mock

// Helper: a child component that reads from the session context
const SessionConsumer = ({ onRender }: { onRender: (ctx: ReturnType<typeof useSession>) => void }) => {
  const ctx = useSession()
  onRender(ctx)
  return null
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SessionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default: no stored session
    mockGetItem.mockResolvedValue(null)
    mockSetItem.mockResolvedValue(undefined)
    mockDeleteItem.mockResolvedValue(undefined)
  })

  it('renders children without crashing', async () => {
    let tree: renderer.ReactTestRenderer | undefined
    await act(async () => {
      tree = renderer.create(
        <SessionProvider>
          <React.Fragment />
        </SessionProvider>
      )
    })
    expect(tree).toBeTruthy()
  })

  it('exposes default auth state (unauthenticated) after hydration with no stored tokens', async () => {
    let captured: ReturnType<typeof useSession> | undefined

    await act(async () => {
      renderer.create(
        <SessionProvider>
          <SessionConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </SessionProvider>
      )
    })

    expect(captured).toBeDefined()
    expect(captured!.auth.role).toBeNull()
    expect(captured!.auth.token).toBeNull()
    expect(captured!.isLoading).toBe(false)
    expect(captured!.storedAuthTokens[TUserRole.PRO]).toBeNull()
    expect(captured!.storedAuthTokens[TUserRole.RECRUITER]).toBeNull()
  })

  it('hydrates session from SecureStore when tokens are persisted', async () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'role') return Promise.resolve(TUserRole.PRO)
      if (key === TUserRole.PRO) return Promise.resolve('pro-token-123')
      if (key === TUserRole.RECRUITER) return Promise.resolve(null)
      return Promise.resolve(null)
    })

    let captured: ReturnType<typeof useSession> | undefined

    await act(async () => {
      renderer.create(
        <SessionProvider>
          <SessionConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </SessionProvider>
      )
    })

    expect(captured!.auth.role).toBe(TUserRole.PRO)
    expect(captured!.auth.token).toBe('pro-token-123')
    expect(captured!.storedAuthTokens[TUserRole.PRO]).toBe('pro-token-123')
  })

  it('signIn calls the API, persists tokens, and updates auth state', async () => {
    mockApiSignIn.mockResolvedValue({ category: TUserRole.PRO, token: 'new-token' })

    let captured: ReturnType<typeof useSession> | undefined

    await act(async () => {
      renderer.create(
        <SessionProvider>
          <SessionConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </SessionProvider>
      )
    })

    await act(async () => {
      await captured!.signIn('user@test.com', 'password123')
    })

    expect(mockApiSignIn).toHaveBeenCalledWith('user@test.com', 'password123')
    expect(mockSetItem).toHaveBeenCalledWith(TUserRole.PRO, 'new-token')
    expect(mockSetItem).toHaveBeenCalledWith('role', TUserRole.PRO)
    expect(captured!.auth.role).toBe(TUserRole.PRO)
    expect(captured!.auth.token).toBe('new-token')
  })

  it('signOut removes the token and clears auth when no other role is stored', async () => {
    // Start with a PRO session, no RECRUITER token
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'role') return Promise.resolve(TUserRole.PRO)
      if (key === TUserRole.PRO) return Promise.resolve('pro-token-abc')
      return Promise.resolve(null)
    })

    let captured: ReturnType<typeof useSession> | undefined

    await act(async () => {
      renderer.create(
        <SessionProvider>
          <SessionConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </SessionProvider>
      )
    })

    await act(async () => {
      captured!.signOut(TUserRole.PRO)
    })

    expect(mockDeleteItem).toHaveBeenCalledWith(TUserRole.PRO)
    expect(captured!.auth.role).toBeNull()
    expect(captured!.auth.token).toBeNull()
  })

  it('signOut switches to the other role when its token exists', async () => {
    // Both tokens stored, active role is PRO
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'role') return Promise.resolve(TUserRole.PRO)
      if (key === TUserRole.PRO) return Promise.resolve('pro-token')
      if (key === TUserRole.RECRUITER) return Promise.resolve('recruiter-token')
      return Promise.resolve(null)
    })

    let captured: ReturnType<typeof useSession> | undefined

    await act(async () => {
      renderer.create(
        <SessionProvider>
          <SessionConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </SessionProvider>
      )
    })

    await act(async () => {
      captured!.signOut(TUserRole.PRO)
    })

    expect(mockDeleteItem).toHaveBeenCalledWith(TUserRole.PRO)
    expect(mockSetItem).toHaveBeenCalledWith('role', TUserRole.RECRUITER)
    expect(captured!.auth.role).toBe(TUserRole.RECRUITER)
    expect(captured!.auth.token).toBe('recruiter-token')
  })

  it('switchAuth updates active auth to the requested role', async () => {
    // Both tokens stored, active role is PRO
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'role') return Promise.resolve(TUserRole.PRO)
      if (key === TUserRole.PRO) return Promise.resolve('pro-token')
      if (key === TUserRole.RECRUITER) return Promise.resolve('recruiter-token')
      return Promise.resolve(null)
    })

    let captured: ReturnType<typeof useSession> | undefined

    await act(async () => {
      renderer.create(
        <SessionProvider>
          <SessionConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </SessionProvider>
      )
    })

    await act(async () => {
      captured!.switchAuth(TUserRole.RECRUITER)
    })

    expect(mockSetItem).toHaveBeenCalledWith('role', TUserRole.RECRUITER)
    expect(captured!.auth.role).toBe(TUserRole.RECRUITER)
    expect(captured!.auth.token).toBe('recruiter-token')
  })

  it('useSession throws when called outside a SessionProvider', () => {
    const BadConsumer = () => {
      useSession()
      return null
    }

    // In non-production env the hook throws when context value is falsy.
    // The default context value is a real object, so we test the guard by
    // checking NODE_ENV branch: temporarily make useContext return null.
    const { useContext } = require('react')
    const spy = jest.spyOn(require('react'), 'useContext').mockReturnValueOnce(null)

    expect(() => {
      renderer.create(<BadConsumer />)
    }).toThrow('useSession must be wrapped in a <SessionProvider />')

    spy.mockRestore()
  })
})
