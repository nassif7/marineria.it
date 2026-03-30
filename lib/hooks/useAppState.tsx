import { useEffect, useState, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'

type UseApeStateHandlers = {
  onChange?: (() => void) | (<T>() => Promise<T>)
  onForeground?: (() => void) | (<T>() => Promise<T>)
  onBackGround?: (() => void) | (<T>() => Promise<T>)
}

const useAppState: (handlers?: UseApeStateHandlers) => AppStateStatus = (handlers) => {
  const currentState = useRef(AppState.currentState)
  const [appState, setAppState] = useState(currentState.current)
  const { onChange, onForeground, onBackGround } = handlers || {}

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (currentState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        onBackGround && onBackGround()
      }

      if (currentState.current.match(/inactive|background/) && nextAppState === 'active') {
        onForeground && onForeground()
      }
      currentState.current = nextAppState
      setAppState(currentState.current)

      onChange && onChange()
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return appState
}

export default useAppState
