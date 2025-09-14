'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <Card className="mx-4 sm:mx-0">
          <CardHeader>
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
            <CardDescription>
              An error occurred while interacting with the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {this.state.error?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>
            <Button onClick={this.resetError} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Hook for handling Web3 errors
export function useWeb3ErrorHandler() {
  const handleError = (error: any, context: string) => {
    console.error(`Web3 Error in ${context}:`, error)
    
    // Common error patterns
    if (error?.code === 4001) {
      return 'Transaction rejected by user'
    }
    if (error?.code === -32603) {
      return 'Internal JSON-RPC error'
    }
    if (error?.message?.includes('insufficient funds')) {
      return 'Insufficient funds for transaction'
    }
    if (error?.message?.includes('gas')) {
      return 'Gas estimation failed'
    }
    if (error?.message?.includes('network')) {
      return 'Network error occurred'
    }
    
    return error?.message || 'An unexpected error occurred'
  }

  return { handleError }
}
