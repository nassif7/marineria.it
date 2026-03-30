import React from 'react'
import { View } from 'react-native'
import { Heading, Text, Button, ButtonText } from '@/lib/components/ui'

type Props = React.PropsWithChildren
type State = { hasError: boolean }

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Heading size="xl" className="text-center mb-2">
            Something went wrong
          </Heading>
          <Text className="text-center text-typography-600 mb-6">An unexpected error occurred. Please try again.</Text>
          <Button onPress={() => this.setState({ hasError: false })}>
            <ButtonText>Try again</ButtonText>
          </Button>
        </View>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
