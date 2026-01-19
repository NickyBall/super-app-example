/**
 * Shared Bridge Types
 *
 * This file defines the TypeScript types for communication between
 * the native host apps (Android/iOS) and the React mini-apps
 */

/**
 * Base structure for all bridge messages
 */
export interface BridgeMessage {
  type: string
  data?: any
}

/**
 * User information returned from native
 */
export interface UserInfo {
  userId: string
  name: string
  email: string
}

/**
 * Message types sent FROM mini-app TO native
 */
export type NativeMessageType =
  | 'getUserInfo'      // Request user information
  | 'showToast'        // Show native toast/alert
  | 'navigate'         // Navigate to a native screen
  | 'log'              // Log to native console

/**
 * Message types sent FROM native TO mini-app
 */
export type JSMessageType =
  | 'userInfo'         // User information response
  | 'notification'     // Push notification received
  | 'deepLink'         // Deep link opened

/**
 * Typed message payloads for specific message types
 */
export interface MessagePayloads {
  // From Mini-App to Native
  getUserInfo: undefined
  showToast: { message: string }
  navigate: { screen: string }
  log: { message: string }

  // From Native to Mini-App
  userInfo: UserInfo
  notification: { title: string; body: string }
  deepLink: { url: string }
}

/**
 * Type-safe bridge message creator
 */
export function createBridgeMessage<T extends keyof MessagePayloads>(
  type: T,
  data?: MessagePayloads[T]
): BridgeMessage {
  return { type, data }
}
