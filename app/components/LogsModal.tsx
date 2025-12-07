"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogEntry, LogType } from "@/app/types/logs"

interface LogsModalProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  logs: LogEntry[]
  showTrigger?: boolean
}

export default function LogsModal({
  isOpen: controlledOpen,
  onOpenChange,
  logs,
  showTrigger = true
}: LogsModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  // Use controlled or uncontrolled state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalOpen(open)
    }
  }

  // Ensure we only render portal on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleExpanded = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(logId)) {
        newSet.delete(logId)
      } else {
        newSet.add(logId)
      }
      return newSet
    })
  }

  const getLogTypeStyles = (type: LogType) => {
    switch (type) {
      case 'info':
        return 'bg-topic/20 text-topic border-topic/50'
      case 'success':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'api-call':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50'
      case 'api-response':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
      default:
        return 'bg-white/20 text-white/80 border-white/50'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const ms = date.getMilliseconds().toString().padStart(3, '0')
    return `${hours}:${minutes}:${seconds}.${ms}`
  }

  // Sort logs in reverse chronological order (newest first)
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp)

  const modalContent = isOpen && mounted ? (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative glass-panel border border-white/20 rounded-2xl p-6
                   max-w-3xl w-full max-h-[80vh] overflow-y-auto
                   shadow-2xl animate-slide-in bg-obsidian/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20
                     transition-colors duration-200 z-10"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <FileText className="w-6 h-6 text-topic" />
          <div>
            <h3 className="text-white font-bold text-lg">System Activity Logs</h3>
            <p className="text-white/50 text-xs">
              {logs.length > 0
                ? `${logs.length} log ${logs.length === 1 ? 'entry' : 'entries'} • Live API activity and system events`
                : 'No logs yet'}
            </p>
          </div>
        </div>

        {/* Logs List */}
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No logs yet. Generate content to see activity.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedLogs.map((log) => {
              const isExpanded = expandedLogs.has(log.id)
              const hasExpandableContent = log.details && log.details.length > 0

              return (
                <div
                  key={log.id}
                  className="border-b border-white/10 py-3 px-4 hover:bg-white/5 rounded-lg
                             transition-colors duration-200"
                >
                  {/* Log Header */}
                  <div className="flex items-start gap-3">
                    {/* Timestamp */}
                    <span className="text-white/40 text-xs font-mono flex-shrink-0 mt-0.5">
                      [{formatTimestamp(log.timestamp)}]
                    </span>

                    {/* Type Badge */}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${getLogTypeStyles(log.type)}`}>
                      {log.type.toUpperCase()}
                    </span>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm leading-relaxed break-words">
                        {log.message}
                      </p>

                      {/* Metadata */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-1 text-xs text-white/50 space-y-0.5">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <span className="text-white/40">↳</span>
                              <span className="font-medium">{key}:</span>
                              <span className="font-mono">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Details Section */}
                      {hasExpandableContent && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleExpanded(log.id)}
                            className="flex items-center gap-1 text-xs text-topic/80 hover:text-topic
                                     transition-colors duration-200"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                <span>Hide details</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                <span>View details</span>
                              </>
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 bg-white/5 rounded p-3 border border-white/10 animate-slide-in">
                              <pre className="font-mono text-xs text-white/70 whitespace-pre-wrap break-words overflow-x-auto">
                                {log.details}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        {logs.length > 0 && (
          <p className="text-white/40 text-xs text-center mt-4 italic">
            Logs are displayed in reverse chronological order (newest first)
          </p>
        )}
      </div>
    </div>
  ) : null

  return (
    <>
      {/* Trigger Button - only show if showTrigger is true */}
      {showTrigger && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          className="glass-panel border-white/20 hover:border-topic/50 hover:bg-topic/10
                     text-white/80 hover:text-white transition-all duration-200
                     flex items-center gap-2 px-3 py-2"
        >
          <FileText className="w-4 h-4 text-topic" />
          <span className="text-xs font-medium">System Logs ({logs.length})</span>
        </Button>
      )}

      {/* Portal Modal - renders at document.body level */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}
