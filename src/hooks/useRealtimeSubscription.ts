'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

type Tables = keyof Database['public']['Tables']
type TableRow<T extends Tables> = Database['public']['Tables'][T]['Row']

interface UseRealtimeOptions<T extends Tables> {
  table: T
  filter?: {
    column: string
    value: string | number
  }
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  onInsert?: (payload: TableRow<T>) => void
  onUpdate?: (payload: { old: TableRow<T>; new: TableRow<T> }) => void
  onDelete?: (payload: TableRow<T>) => void
}

/**
 * Hook for real-time subscriptions to database changes
 */
export function useRealtimeSubscription<T extends Tables>({
  table,
  filter,
  event = '*',
  onInsert,
  onUpdate,
  onDelete
}: UseRealtimeOptions<T>) {
  const [data, setData] = useState<TableRow<T>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let subscription: RealtimeChannel

    const setupSubscription = async () => {
      try {
        // Initial data fetch
        let query = supabase.from(table).select('*')
        
        if (filter) {
          query = query.eq(filter.column, filter.value)
        }

        const { data: initialData, error: fetchError } = await query

        if (fetchError) {
          throw fetchError
        }

        setData(initialData as TableRow<T>[])
        setLoading(false)

        // Set up real-time subscription
        subscription = supabase
          .channel(`${table}_changes`)
          .on(
            'postgres_changes' as any,
            {
              event,
              schema: 'public',
              table,
              ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
            },
            (payload: RealtimePostgresChangesPayload<TableRow<T>>) => {
              console.log('Realtime event:', payload)

              switch (payload.eventType) {
                case 'INSERT':
                  if (payload.new) {
                    setData(prev => [...prev, payload.new as TableRow<T>])
                    onInsert?.(payload.new as TableRow<T>)
                  }
                  break
                
                case 'UPDATE':
                  if (payload.new && payload.old) {
                    setData(prev => 
                      prev.map(item => 
                        (item as any).id === (payload.old as any).id 
                          ? payload.new as TableRow<T>
                          : item
                      )
                    )
                    onUpdate?.({
                      old: payload.old as TableRow<T>,
                      new: payload.new as TableRow<T>
                    })
                  }
                  break
                
                case 'DELETE':
                  if (payload.old) {
                    setData(prev => 
                      prev.filter(item => (item as any).id !== (payload.old as any).id)
                    )
                    onDelete?.(payload.old as TableRow<T>)
                  }
                  break
              }
            }
          )
          .subscribe()

        setChannel(subscription)
      } catch (err) {
        console.error('Subscription error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    setupSubscription()

    // Cleanup
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [table, filter?.column, filter?.value, event])

  const refresh = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase.from(table).select('*')
      
      if (filter) {
        query = query.eq(filter.column, filter.value)
      }

      const { data: refreshedData, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setData(refreshedData as TableRow<T>[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    refresh,
    channel
  }
}

/**
 * Hook for real-time presence (who's online)
 */
export function usePresence(channelName: string, userId: string) {
  const [presence, setPresence] = useState<any[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const presenceChannel = supabase.channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState()
        setPresence(Object.values(state).flat())
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: userId,
            online_at: new Date().toISOString()
          })
        }
      })

    setChannel(presenceChannel)

    return () => {
      presenceChannel.untrack()
      supabase.removeChannel(presenceChannel)
    }
  }, [channelName, userId])

  return { presence, channel }
}

/**
 * Hook for real-time broadcast (custom events)
 */
export function useBroadcast(channelName: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const broadcastChannel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload])
      })
      .subscribe()

    setChannel(broadcastChannel)

    return () => {
      supabase.removeChannel(broadcastChannel)
    }
  }, [channelName])

  const broadcast = async (message: any) => {
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'message',
        payload: message
      })
    }
  }

  return { messages, broadcast, channel }
}