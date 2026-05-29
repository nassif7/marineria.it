import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/Providers/SessionProvider'
import { getRecruiterUserProfilePost, getRecruiterActiveSearchesPost } from '@/api'
import { TRecruiterUser, TRecruiterSearch } from '@/api/types'

type TRecruiterContext = {
  token: string
  recruiter?: TRecruiterUser
  searches: TRecruiterSearch[]
  isLoading: boolean
  isRefetching: boolean
  refetch: () => void
}

const RecruiterContext = createContext<TRecruiterContext>({
  token: '',
  recruiter: undefined,
  searches: [],
  isLoading: false,
  isRefetching: false,
  refetch: () => {},
})

export const useRecruiter = () => useContext(RecruiterContext)

const RecruiterProvider = ({ children }: React.PropsWithChildren) => {
  const {
    i18n: { language },
  } = useTranslation()
  const { auth } = useSession()
  const token = auth.token ?? ''

  const {
    data: recruiter,
    isLoading: recruiterLoading,
    isRefetching: recruiterRefetching,
    refetch: refetchRecruiter,
  } = useQuery({
    queryKey: ['recruiter-profile', token, language],
    queryFn: () => getRecruiterUserProfilePost(token, language),
    enabled: !!token,
  })

  const {
    data: searches = [],
    isLoading: searchesLoading,
    isRefetching: searchesRefetching,
    refetch: refetchSearches,
  } = useQuery({
    queryKey: ['recruiter-searches', token, language],
    queryFn: () => getRecruiterActiveSearchesPost(token, language),
    enabled: !!token,
  })

  return (
    <RecruiterContext.Provider
      value={{
        token,
        recruiter,
        searches,
        isLoading: recruiterLoading || searchesLoading,
        isRefetching: recruiterRefetching || searchesRefetching,
        refetch: () => {
          refetchRecruiter()
          refetchSearches()
        },
      }}
    >
      {children}
    </RecruiterContext.Provider>
  )
}

export default RecruiterProvider
