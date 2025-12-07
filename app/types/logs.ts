export type LogType = 'info' | 'success' | 'error' | 'api-call' | 'api-response'

export interface LogEntry {
  id: string
  timestamp: number
  type: LogType
  message: string
  details?: string  // For truncated content (prompts, responses, etc.)
  metadata?: Record<string, any>
}

export function createLog(type: LogType, message: string, details?: string, metadata?: Record<string, any>): LogEntry {
  return {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    type,
    message,
    details,
    metadata
  }
}

export function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
