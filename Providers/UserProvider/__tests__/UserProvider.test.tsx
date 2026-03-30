import React from 'react'
import renderer, { act } from 'react-test-renderer'

// ---------------------------------------------------------------------------
// Module mocks
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

const mockUseQuery = jest.fn()
const mockUseMutation = jest.fn()
const mockInvalidateQueries = jest.fn()
const mockUseQueryClient = jest.fn(() => ({ invalidateQueries: mockInvalidateQueries }))

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
  useMutation: (...args: any[]) => mockUseMutation(...args),
  useQueryClient: () => mockUseQueryClient(),
  QueryClient: jest.fn(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

jest.mock('@/api', () => ({
  getUserProfile: jest.fn(),
  setPushNotificationToken: jest.fn(),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
}))

jest.mock('@/Providers/SessionProvider', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/hooks/useNotification', () => ({
  registerForPushNotificationsAsync: jest.fn(),
}))

// ---------------------------------------------------------------------------

import * as SecureStore from 'expo-secure-store'
import { useSession } from '@/Providers/SessionProvider'
import UserProvider, { useUser, useActiveProfile } from '../UserProvider'
import { TUserRole } from '@/api/types'

const mockUseSession = useSession as jest.Mock
const mockSetItem = SecureStore.setItemAsync as jest.Mock

// A minimal TUser fixture — only fill required fields used in tests
const fakeUser = {
  name: 'Mario',
  surname: 'Rossi',
  email: 'mario@test.it',
  iduser: 42,
  pushNotificationToken: '',
} as any

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type CapturedUser = ReturnType<typeof useUser>
type CapturedProfile = ReturnType<typeof useActiveProfile>

const UserConsumer = ({ onRender }: { onRender: (ctx: CapturedUser) => void }) => {
  const ctx = useUser()
  onRender(ctx)
  return null
}

const ActiveProfileConsumer = ({ onRender }: { onRender: (ctx: CapturedProfile) => void }) => {
  const ctx = useActiveProfile()
  onRender(ctx)
  return null
}

const buildDefaultSessionMock = (overrides: Partial<{ role: TUserRole | null; token: string | null }> = {}) => {
  mockUseSession.mockReturnValue({
    auth: { role: overrides.role ?? null, token: overrides.token ?? null },
    switchAuth: jest.fn(),
    signOut: jest.fn(),
    storedAuthTokens: { [TUserRole.PRO]: null, [TUserRole.RECRUITER]: null },
    isLoading: false,
    signIn: jest.fn(),
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('UserProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSetItem.mockResolvedValue(undefined)

    // Provide sensible defaults for query hooks
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, refetch: jest.fn() })
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), isPending: false })
    mockUseQueryClient.mockReturnValue({ invalidateQueries: mockInvalidateQueries })
  })

  it('renders children without crashing', async () => {
    buildDefaultSessionMock()
    let tree: renderer.ReactTestRenderer | undefined

    await act(async () => {
      tree = renderer.create(
        <UserProvider>
          <React.Fragment />
        </UserProvider>
      )
    })

    expect(tree).toBeTruthy()
  })

  it('exposes undefined user and activeProfile when not authenticated', async () => {
    buildDefaultSessionMock({ role: null, token: null })

    let captured: CapturedUser | undefined

    await act(async () => {
      renderer.create(
        <UserProvider>
          <UserConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </UserProvider>
      )
    })

    expect(captured!.user).toBeUndefined()
    expect(captured!.activeProfile).toBeUndefined()
    expect(captured!.isLoading).toBe(false)
  })

  it('exposes user data and activeProfile when authenticated', async () => {
    buildDefaultSessionMock({ role: TUserRole.PRO, token: 'tok-pro' })
    mockUseQuery.mockReturnValue({ data: fakeUser, isLoading: false, refetch: jest.fn() })

    let captured: CapturedUser | undefined

    await act(async () => {
      renderer.create(
        <UserProvider>
          <UserConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </UserProvider>
      )
    })

    expect(captured!.user).toEqual(fakeUser)
    expect(captured!.activeProfile).toEqual({ role: TUserRole.PRO, token: 'tok-pro' })
  })

  it('passes correct queryKey and enabled flag to useQuery', async () => {
    buildDefaultSessionMock({ role: TUserRole.RECRUITER, token: 'tok-rec' })

    await act(async () => {
      renderer.create(
        <UserProvider>
          <React.Fragment />
        </UserProvider>
      )
    })

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(['user', 'tok-rec', TUserRole.RECRUITER]),
        enabled: true,
      })
    )
  })

  it('does not enable the query when token or role is missing', async () => {
    buildDefaultSessionMock({ role: null, token: null })

    await act(async () => {
      renderer.create(
        <UserProvider>
          <React.Fragment />
        </UserProvider>
      )
    })

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }))
  })

  it('switchProfile persists the role to SecureStore and calls switchAuth', async () => {
    const mockSwitchAuth = jest.fn()
    mockUseSession.mockReturnValue({
      auth: { role: TUserRole.PRO, token: 'tok-pro' },
      switchAuth: mockSwitchAuth,
      signOut: jest.fn(),
      storedAuthTokens: { [TUserRole.PRO]: 'tok-pro', [TUserRole.RECRUITER]: 'tok-rec' },
      isLoading: false,
      signIn: jest.fn(),
    })

    let captured: CapturedUser | undefined

    await act(async () => {
      renderer.create(
        <UserProvider>
          <UserConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </UserProvider>
      )
    })

    await act(async () => {
      await captured!.switchProfile(TUserRole.RECRUITER)
    })

    expect(mockSetItem).toHaveBeenCalledWith('role', TUserRole.RECRUITER)
    expect(mockSwitchAuth).toHaveBeenCalledWith(TUserRole.RECRUITER)
  })

  it('useActiveProfile throws when activeProfile is undefined', () => {
    buildDefaultSessionMock({ role: null, token: null })
    // useQuery returns no data → activeProfile will be undefined
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false })

    expect(() => {
      renderer.create(
        <UserProvider>
          <ActiveProfileConsumer onRender={() => {}} />
        </UserProvider>
      )
    }).toThrow('useActiveProfile must be used within an authenticated screen')
  })

  it('useActiveProfile returns the active profile when authenticated', async () => {
    buildDefaultSessionMock({ role: TUserRole.PRO, token: 'tok-pro' })

    let captured: CapturedProfile | undefined

    await act(async () => {
      renderer.create(
        <UserProvider>
          <ActiveProfileConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </UserProvider>
      )
    })

    expect(captured).toEqual({ role: TUserRole.PRO, token: 'tok-pro' })
  })

  it('exposes togglePushNotifications from useMutation', async () => {
    buildDefaultSessionMock({ role: TUserRole.PRO, token: 'tok-pro' })
    const mockToggle = jest.fn()
    mockUseMutation.mockReturnValue({ mutate: mockToggle, isPending: false })

    let captured: CapturedUser | undefined

    await act(async () => {
      renderer.create(
        <UserProvider>
          <UserConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </UserProvider>
      )
    })

    captured!.togglePushNotifications()
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })
})
