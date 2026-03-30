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
  useLocalSearchParams: jest.fn(() => ({ searchId: 'search-42' })),
}))

const mockUseQueries = jest.fn()

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ data: null, isLoading: false, refetch: jest.fn() })),
  useMutation: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  useQueryClient: jest.fn(() => ({ invalidateQueries: jest.fn() })),
  useQueries: (...args: any[]) => mockUseQueries(...args),
  QueryClient: jest.fn(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

jest.mock('@/api', () => ({
  getRecruiterSearchById: jest.fn(),
  getCrewList: jest.fn(),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
}))

jest.mock('@/Providers/UserProvider', () => ({
  useActiveProfile: jest.fn(),
}))

// ---------------------------------------------------------------------------

import { useLocalSearchParams } from 'expo-router'
import { useActiveProfile } from '@/Providers/UserProvider'
import RecruiterSearchProvider, { useRecruiterSearch } from '../index'
import { TUserRole } from '@/api/types'

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock
const mockUseActiveProfile = useActiveProfile as jest.Mock

// ---------------------------------------------------------------------------
// Default query result factory
// ---------------------------------------------------------------------------

const buildQueryResult = (overrides: Partial<ReturnType<typeof makeQueryResult>> = {}) => makeQueryResult(overrides)

function makeQueryResult(overrides: Record<string, any> = {}) {
  return {
    data: undefined,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isRefetching: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type CapturedSearch = ReturnType<typeof useRecruiterSearch>

const SearchConsumer = ({ onRender }: { onRender: (ctx: CapturedSearch) => void }) => {
  const ctx = useRecruiterSearch()
  onRender(ctx)
  return null
}

function setupMocks(
  searchResult: ReturnType<typeof makeQueryResult> = makeQueryResult(),
  crewResult: ReturnType<typeof makeQueryResult> = makeQueryResult()
) {
  mockUseActiveProfile.mockReturnValue({ role: TUserRole.RECRUITER, token: 'tok-rec' })
  mockUseLocalSearchParams.mockReturnValue({ searchId: 'search-42' })
  mockUseQueries.mockReturnValue([searchResult, crewResult])
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RecruiterSearchProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupMocks()
  })

  it('renders children without crashing', async () => {
    let tree: renderer.ReactTestRenderer | undefined

    await act(async () => {
      tree = renderer.create(
        <RecruiterSearchProvider>
          <React.Fragment />
        </RecruiterSearchProvider>
      )
    })

    expect(tree).toBeTruthy()
  })

  it('exposes default loading state when queries are pending', async () => {
    setupMocks(makeQueryResult({ isLoading: true }), makeQueryResult({ isLoading: true }))

    let captured: CapturedSearch | undefined

    await act(async () => {
      renderer.create(
        <RecruiterSearchProvider>
          <SearchConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </RecruiterSearchProvider>
      )
    })

    expect(captured!.search.isLoading).toBe(true)
    expect(captured!.crewList.isLoading).toBe(true)
  })

  it('exposes resolved data from both queries', async () => {
    const fakeSearch = { id: 'search-42', title: 'Chef de Cuisine' }
    const fakeCrewList = [{ id: 1, name: 'Luigi' }]

    setupMocks(
      makeQueryResult({ data: [fakeSearch], isSuccess: true }),
      makeQueryResult({ data: fakeCrewList, isSuccess: true })
    )

    let captured: CapturedSearch | undefined

    await act(async () => {
      renderer.create(
        <RecruiterSearchProvider>
          <SearchConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </RecruiterSearchProvider>
      )
    })

    // search.data is set to searchQuery.data?.[0]
    expect(captured!.search.data).toEqual(fakeSearch)
    expect(captured!.search.isSuccess).toBe(true)
    expect(captured!.crewList.data).toEqual(fakeCrewList)
    expect(captured!.crewList.isSuccess).toBe(true)
  })

  it('exposes error state when a query fails', async () => {
    const err = new Error('Network error')

    setupMocks(makeQueryResult({ isError: true, error: err }), makeQueryResult())

    let captured: CapturedSearch | undefined

    await act(async () => {
      renderer.create(
        <RecruiterSearchProvider>
          <SearchConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </RecruiterSearchProvider>
      )
    })

    expect(captured!.search.isError).toBe(true)
    expect(captured!.search.error).toBe(err)
  })

  it('refetchAll calls refetch on both underlying queries', async () => {
    const searchRefetch = jest.fn()
    const crewRefetch = jest.fn()

    setupMocks(makeQueryResult({ refetch: searchRefetch }), makeQueryResult({ refetch: crewRefetch }))

    let captured: CapturedSearch | undefined

    await act(async () => {
      renderer.create(
        <RecruiterSearchProvider>
          <SearchConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
        </RecruiterSearchProvider>
      )
    })

    captured!.refetchAll()

    expect(searchRefetch).toHaveBeenCalledTimes(1)
    expect(crewRefetch).toHaveBeenCalledTimes(1)
  })

  it('passes searchId and token from hooks to useQueries', async () => {
    mockUseActiveProfile.mockReturnValue({ role: TUserRole.RECRUITER, token: 'my-token' })
    mockUseLocalSearchParams.mockReturnValue({ searchId: 'abc-99' })

    await act(async () => {
      renderer.create(
        <RecruiterSearchProvider>
          <React.Fragment />
        </RecruiterSearchProvider>
      )
    })

    const callArg = mockUseQueries.mock.calls[0][0] as { queries: Array<{ queryKey: unknown[] }> }
    const [searchQuery, crewQuery] = callArg.queries

    expect(searchQuery.queryKey).toContain('abc-99')
    expect(crewQuery.queryKey).toContain('abc-99')
  })

  it('useRecruiterSearch returns default context values outside a provider', () => {
    // useRecruiterSearch is a plain useContext call with a non-null default —
    // it returns the default context object rather than throwing.
    let captured: CapturedSearch | undefined

    const Standalone = () => {
      captured = useRecruiterSearch()
      return null
    }

    // Render without a provider — should not throw
    renderer.create(<Standalone />)

    expect(captured).toBeDefined()
    expect(typeof captured!.refetchAll).toBe('function')
    expect(captured!.search.isLoading).toBe(false)
    expect(captured!.crewList.isLoading).toBe(false)
  })
})
