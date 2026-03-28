import { createContext, useContext } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQueries } from '@tanstack/react-query'
import { TRecruiterSearch, TCrewSimple } from '@/api/types'
import { getRecruiterSearchById, getCrewList } from '@/api'
import { useTranslation } from 'react-i18next'
import { useActiveProfile } from '@/Providers/UserProvider'

type TSearchQueryState<T> = {
  data?: T
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isRefetching: boolean
  error: Error | null
  refetch: () => void
}

type TRecruiterSearchContext = {
  search: TSearchQueryState<TRecruiterSearch>
  crewList: TSearchQueryState<TCrewSimple[]>
  refetchAll: () => void
}

// const SearchContext = createContext<TRecruiterSearchContext>({
//   isLoading: false,
//   isLoadingSearch: false,
//   isLoadingCrewList: false,
//   refetchCrewList: () => {},
// })

const defaultQueryState = <T,>(): TSearchQueryState<T> => ({
  data: undefined,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isRefetching: false,
  error: null,
  refetch: () => {},
})

const SearchContext = createContext<TRecruiterSearchContext>({
  search: defaultQueryState<TRecruiterSearch>(),
  crewList: defaultQueryState<TCrewSimple[]>(),
  refetchAll: () => {},
})

export const useRecruiterSearch = () => useContext(SearchContext)

const RecruiterSearchProvider = ({ children }: React.PropsWithChildren) => {
  const {
    i18n: { language },
  } = useTranslation()

  const { searchId } = useLocalSearchParams<{ searchId: string }>()
  const { token } = useActiveProfile()

  const [searchQuery, crewListQuery] = useQueries({
    queries: [
      {
        queryKey: ['recruiter-search-by-id', searchId, language],
        queryFn: () => getRecruiterSearchById(searchId, token, language),
      },
      {
        queryKey: ['recruiter-crew-list', searchId, language],
        queryFn: () => getCrewList(searchId as string, token, language),
      },
    ],
  })

  return (
    <SearchContext.Provider
      value={{
        search: {
          data: searchQuery.data?.[0],
          isLoading: searchQuery.isLoading,
          isSuccess: searchQuery.isSuccess,
          isError: searchQuery.isError,
          isRefetching: searchQuery.isRefetching,
          error: searchQuery.error,
          refetch: searchQuery.refetch,
        },
        crewList: {
          data: crewListQuery.data,
          isLoading: crewListQuery.isLoading,
          isSuccess: crewListQuery.isSuccess,
          isError: crewListQuery.isError,
          isRefetching: crewListQuery.isRefetching,
          error: crewListQuery.error,
          refetch: crewListQuery.refetch,
        },
        refetchAll: () => {
          searchQuery.refetch()
          crewListQuery.refetch()
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export default RecruiterSearchProvider
