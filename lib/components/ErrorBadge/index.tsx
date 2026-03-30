import React from 'react'
import { Badge, BadgeText } from '@/lib/components/ui'

interface ErrorBadgeProps {
  label: string
  className?: string
}

const ErrorBadge: React.FC<ErrorBadgeProps> = ({ label, className = 'rounded-md self-start' }) => (
  <Badge action="error" variant="outline" className={className}>
    <BadgeText className="text-error-900">{label}</BadgeText>
  </Badge>
)

export default ErrorBadge
