import { useEffect, useRef, useCallback } from 'react'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { addNotification } from '../store/notificationSlice'
import { Notification } from '../types/message'

let stompClient: Client | null = null

export function useWebSocket() {
  const { accessToken, user } = useSelector((s: RootState) => s.auth)
  const dispatch = useDispatch()
  const subscriptions = useRef<Map<string, StompSubscription>>(new Map())

  useEffect(() => {
    if (!accessToken || !user) return

    stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to private notifications
        stompClient?.subscribe(`/user/${user.id}/queue/notifications`, (msg: IMessage) => {
          const notification: Notification = JSON.parse(msg.body)
          dispatch(addNotification(notification))
        })
      },
      onDisconnect: () => {
        subscriptions.current.clear()
      },
    })

    stompClient.activate()

    return () => {
      stompClient?.deactivate()
      stompClient = null
    }
  }, [accessToken, user, dispatch])

  const subscribe = useCallback((destination: string, callback: (msg: IMessage) => void) => {
    if (!stompClient?.connected) return
    const existing = subscriptions.current.get(destination)
    if (existing) return
    const sub = stompClient.subscribe(destination, callback)
    subscriptions.current.set(destination, sub)
  }, [])

  const unsubscribe = useCallback((destination: string) => {
    const sub = subscriptions.current.get(destination)
    sub?.unsubscribe()
    subscriptions.current.delete(destination)
  }, [])

  const publish = useCallback((destination: string, body: object) => {
    stompClient?.publish({ destination, body: JSON.stringify(body) })
  }, [])

  return { subscribe, unsubscribe, publish }
}
