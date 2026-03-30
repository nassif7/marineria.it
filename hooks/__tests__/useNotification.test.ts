import { act, create } from 'react-test-renderer'
import React from 'react'

// ---------------------------------------------------------------------------
// Module mocks
// All mock factories must be self-contained because jest.mock() is hoisted
// above variable declarations. Shared spy references are stored on a plain
// object that is accessible after hoisting.
// ---------------------------------------------------------------------------

const notifMocks = {
  remove: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  getNotificationChannelsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}

jest.mock('expo-notifications', () => ({
  setNotificationHandler: (...args: unknown[]) => notifMocks.setNotificationHandler(...args),
  getPermissionsAsync: (...args: unknown[]) => notifMocks.getPermissionsAsync(...args),
  requestPermissionsAsync: (...args: unknown[]) => notifMocks.requestPermissionsAsync(...args),
  getExpoPushTokenAsync: (...args: unknown[]) => notifMocks.getExpoPushTokenAsync(...args),
  getNotificationChannelsAsync: (...args: unknown[]) => notifMocks.getNotificationChannelsAsync(...args),
  setNotificationChannelAsync: (...args: unknown[]) => notifMocks.setNotificationChannelAsync(...args),
  scheduleNotificationAsync: (...args: unknown[]) => notifMocks.scheduleNotificationAsync(...args),
  addNotificationReceivedListener: (...args: unknown[]) => notifMocks.addNotificationReceivedListener(...args),
  addNotificationResponseReceivedListener: (...args: unknown[]) =>
    notifMocks.addNotificationResponseReceivedListener(...args),
  AndroidImportance: { MAX: 5 },
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
}))

jest.mock('expo-device', () => ({ isDevice: true }))

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: { extra: { eas: { projectId: 'test-project-id' } } },
  },
}))

const mockRouterPush = jest.fn()
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockRouterPush(...args) },
}))

// ---------------------------------------------------------------------------
// Subject under test
// ---------------------------------------------------------------------------

import useNotification, { schedulePushNotification, registerForPushNotificationsAsync } from '../useNotification'

// ---------------------------------------------------------------------------
// Helper: mount the hook
// ---------------------------------------------------------------------------

type HookResult = ReturnType<typeof useNotification>
type HookRef = { current: HookResult | null }

const TestComponent = ({ hookRef }: { hookRef: HookRef }) => {
  hookRef.current = useNotification()
  return null
}

const renderHook = (): HookRef => {
  const ref: HookRef = { current: null }
  act(() => {
    create(React.createElement(TestComponent, { hookRef: ref }))
  })
  return ref
}

// ---------------------------------------------------------------------------
// Default mock implementations
// ---------------------------------------------------------------------------

const setupDefaultMocks = () => {
  notifMocks.remove.mockReset()
  notifMocks.addNotificationReceivedListener.mockReset()
  notifMocks.addNotificationResponseReceivedListener.mockReset()
  notifMocks.getPermissionsAsync.mockReset()
  notifMocks.requestPermissionsAsync.mockReset()
  notifMocks.getExpoPushTokenAsync.mockReset()
  notifMocks.getNotificationChannelsAsync.mockReset()
  notifMocks.setNotificationChannelAsync.mockReset()
  notifMocks.setNotificationHandler.mockReset()
  notifMocks.scheduleNotificationAsync.mockReset()
  mockRouterPush.mockReset()

  notifMocks.addNotificationReceivedListener.mockReturnValue({ remove: notifMocks.remove })
  notifMocks.addNotificationResponseReceivedListener.mockReturnValue({ remove: notifMocks.remove })
  notifMocks.getPermissionsAsync.mockResolvedValue({ status: 'granted' })
  notifMocks.requestPermissionsAsync.mockResolvedValue({ status: 'granted' })
  notifMocks.getExpoPushTokenAsync.mockResolvedValue({ data: 'ExponentPushToken[test]' })
  notifMocks.getNotificationChannelsAsync.mockResolvedValue([])
  notifMocks.scheduleNotificationAsync.mockResolvedValue(undefined)
}

beforeEach(() => {
  setupDefaultMocks()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useNotification — hook shape', () => {
  it('returns the expected properties', () => {
    const ref = renderHook()
    const result = ref.current!

    expect(result).toHaveProperty('expoPushToken')
    expect(result).toHaveProperty('channels')
    expect(result).toHaveProperty('notification')
    expect(result).toHaveProperty('schedulePushNotification')
    expect(result).toHaveProperty('setExpoPushToken')
  })

  it('initialises expoPushToken to an empty string', () => {
    const ref = renderHook()
    expect(ref.current!.expoPushToken).toBe('')
  })

  it('initialises channels to an empty array', () => {
    const ref = renderHook()
    expect(ref.current!.channels).toEqual([])
  })

  it('initialises notification to undefined', () => {
    const ref = renderHook()
    expect(ref.current!.notification).toBeUndefined()
  })

  it('exposes schedulePushNotification as a function', () => {
    const ref = renderHook()
    expect(typeof ref.current!.schedulePushNotification).toBe('function')
  })

  it('exposes setExpoPushToken as a function', () => {
    const ref = renderHook()
    expect(typeof ref.current!.setExpoPushToken).toBe('function')
  })
})

describe('useNotification — effects', () => {
  it('registers notification listeners on mount', async () => {
    await act(async () => {
      renderHook()
    })

    expect(notifMocks.addNotificationReceivedListener).toHaveBeenCalledTimes(1)
    expect(notifMocks.addNotificationResponseReceivedListener).toHaveBeenCalledTimes(1)
  })

  it('calls getPermissionsAsync on mount (via registerForPushNotificationsAsync)', async () => {
    await act(async () => {
      renderHook()
    })

    expect(notifMocks.getPermissionsAsync).toHaveBeenCalledTimes(1)
  })

  it('calls getExpoPushTokenAsync with the configured project id', async () => {
    const ref: HookRef = { current: null }

    await act(async () => {
      create(React.createElement(TestComponent, { hookRef: ref }))
    })

    expect(notifMocks.getExpoPushTokenAsync).toHaveBeenCalledWith({
      projectId: 'test-project-id',
    })
  })
})

describe('useNotification — listener cleanup', () => {
  it('removes both listeners on unmount', async () => {
    let unmount!: () => void

    await act(async () => {
      const ref: HookRef = { current: null }
      const renderer = create(React.createElement(TestComponent, { hookRef: ref }))
      unmount = () => renderer.unmount()
    })

    act(() => {
      unmount()
    })

    expect(notifMocks.remove).toHaveBeenCalledTimes(2)
  })
})

describe('useNotification — permission flow', () => {
  it('requests permissions when existing status is not granted', async () => {
    notifMocks.getPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' })
    notifMocks.requestPermissionsAsync.mockResolvedValueOnce({ status: 'granted' })

    await act(async () => {
      renderHook()
    })

    expect(notifMocks.requestPermissionsAsync).toHaveBeenCalledTimes(1)
  })

  it('does not request permissions when already granted', async () => {
    notifMocks.getPermissionsAsync.mockResolvedValueOnce({ status: 'granted' })

    await act(async () => {
      renderHook()
    })

    expect(notifMocks.requestPermissionsAsync).not.toHaveBeenCalled()
  })

  it('shows an alert and returns undefined when permission is denied', async () => {
    notifMocks.getPermissionsAsync.mockResolvedValueOnce({ status: 'denied' })
    notifMocks.requestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' })

    const savedAlert = global.alert
    const alertMock = jest.fn()
    global.alert = alertMock

    const token = await registerForPushNotificationsAsync()

    expect(token).toBeUndefined()
    expect(alertMock).toHaveBeenCalledWith('Failed to get push token for push notification!')

    global.alert = savedAlert
  })
})

describe('schedulePushNotification (exported helper)', () => {
  it('calls scheduleNotificationAsync with the correct content', async () => {
    await schedulePushNotification()

    expect(notifMocks.scheduleNotificationAsync).toHaveBeenCalledTimes(1)

    const arg = notifMocks.scheduleNotificationAsync.mock.calls[0][0] as {
      content: { title: string; body: string; data: Record<string, unknown> }
      trigger: { type: string; seconds: number }
    }

    expect(arg.content.title).toBe('Marineria!')
    expect(arg.content.body).toBe('There is a job offer for you!')
    expect(arg.trigger.seconds).toBe(2)
  })
})

describe('registerForPushNotificationsAsync (exported helper)', () => {
  it('returns a push token string when running on a physical device', async () => {
    const token = await registerForPushNotificationsAsync()
    expect(token).toBe('ExponentPushToken[test]')
  })
})
