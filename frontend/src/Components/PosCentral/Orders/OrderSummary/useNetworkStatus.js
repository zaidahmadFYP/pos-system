"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to track network connectivity status
 * @returns {boolean} - True if online, false if offline
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Function to update online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Add event listeners for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  return isOnline
}
