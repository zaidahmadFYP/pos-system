"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Drawer,
  CircularProgress,
} from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import PaymentMethodSelector from "../PaymentMethodSelector/PaymentMethodSelector"
import generateDocketSlip from "../DocketSlip/DocketSlip"
import { useNavigate } from "react-router-dom"
import { logError } from "../../Report/utils/logger"
// Import new dependencies for offline functionality
import { openDB } from "idb"
import { useNetworkStatus } from "./useNetworkStatus" // We'll create this custom hook

// Initialize IndexedDB
const initializeDB = async () => {
  return openDB("pos-offline-db", 3, {
    // Increment version to trigger upgrade
    upgrade(db, oldVersion, newVersion, transaction) {
      // Create stores for offline data if they don't exist
      if (!db.objectStoreNames.contains("pendingTransactions")) {
        db.createObjectStore("pendingTransactions", { keyPath: "localId" })
      }

      if (!db.objectStoreNames.contains("pendingPayments")) {
        db.createObjectStore("pendingPayments", { keyPath: "localId" })
      }

      // For cachedTransactions, ensure we have the right key path
      if (db.objectStoreNames.contains("cachedTransactions")) {
        // Delete the old store if it exists and we're upgrading
        if (oldVersion < 3) {
          db.deleteObjectStore("cachedTransactions")
        }
      }

      // Create a new store with the correct key path
      if (!db.objectStoreNames.contains("cachedTransactions")) {
        const store = db.createObjectStore("cachedTransactions", {
          keyPath: "transactionID",
          autoIncrement: false,
        })
      }

      // Create a metadata store for app settings
      if (!db.objectStoreNames.contains("metadata")) {
        const metaStore = db.createObjectStore("metadata", { keyPath: "key" })
        // Initialize with default values
        metaStore.put({ key: "lastTransactionID", value: "000000" })
        metaStore.put({ key: "lastSyncTime", value: new Date().toISOString() })
      }
    },
  })
}

// Generate a unique local ID for offline transactions
const generateLocalId = () => {
  return `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

// Function to get the next transaction ID based on the last known ID
const getNextTransactionID = (lastID) => {
  // Extract the numeric part
  const numericPart = Number.parseInt(lastID.replace(/^0+/, ""), 10)
  // Increment and pad with leading zeros to maintain 6 digits
  return String(numericPart + 1).padStart(6, "0")
}

const OrderSummary = ({
  selectedItems = [],
  onClearItems,
  onDeleteItem,
  initialPaymentMethod,
  recalledTransaction,
}) => {
  const navigate = useNavigate()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialPaymentMethod)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [latestTransactionID, setLatestTransactionID] = useState(recalledTransaction?.transactionID || null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [transactionError, setTransactionError] = useState(null)
  const [scanBuffer, setScanBuffer] = useState("")
  const [scanDebug, setScanDebug] = useState([])
  // New state for offline functionality
  const [db, setDb] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [lastKnownTransactionID, setLastKnownTransactionID] = useState("000000")
  // Use our custom hook to track network status
  const isOnline = useNetworkStatus()

  // Initialize IndexedDB and fetch the latest transaction ID when component mounts
  useEffect(() => {
    const setupDB = async () => {
      try {
        const database = await initializeDB()
        setDb(database)

        // Count pending transactions
        const pendingTxCount = await countPendingTransactions(database)
        setPendingCount(pendingTxCount)

        // Get the last known transaction ID from metadata store
        try {
          const metaStore = database.transaction("metadata", "readonly").objectStore("metadata")
          const lastIDRecord = await metaStore.get("lastTransactionID")

          if (lastIDRecord) {
            setLastKnownTransactionID(lastIDRecord.value)
            console.log("Last known transaction ID from IndexedDB:", lastIDRecord.value)
          }
        } catch (err) {
          console.error("Error getting last transaction ID from IndexedDB:", err)
        }

        // If online, fetch the latest transaction ID from the server
        if (navigator.onLine) {
          fetchLatestTransactionID()
        }
      } catch (error) {
        console.error("Failed to initialize IndexedDB:", error)
        logError("Database", `Failed to initialize offline database: ${error.message}`)
      }
    }

    setupDB()
  }, [])

  // Fetch the latest transaction ID from the server
  const fetchLatestTransactionID = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/transactions/latest-transaction-id`)

      if (response.ok) {
        const data = await response.json()
        if (data && data.latestTransactionID) {
          // Update state and IndexedDB with the latest ID
          setLastKnownTransactionID(data.latestTransactionID)
          console.log("Latest transaction ID from server:", data.latestTransactionID)

          // Update in IndexedDB
          if (db) {
            const metaStore = db.transaction("metadata", "readwrite").objectStore("metadata")
            await metaStore.put({ key: "lastTransactionID", value: data.latestTransactionID })
            console.log("Updated last transaction ID in IndexedDB:", data.latestTransactionID)
          }
        }
      } else {
        // If we can't get the latest ID, try to fetch the latest transactions
        // and extract the ID from there
        await fetchTransactions(true)
      }
    } catch (error) {
      console.error("Error fetching latest transaction ID:", error)
      // Fallback to fetching transactions
      await fetchTransactions(true)
    }
  }

  // Extract the latest transaction ID from fetched transactions
  const extractLatestTransactionID = (transactions) => {
    if (!transactions || transactions.length === 0) return null

    // Sort transactions by ID (assuming they're numeric with leading zeros)
    const sorted = [...transactions].sort((a, b) => {
      const aNum = Number.parseInt(a.transactionID.replace(/^0+/, ""), 10)
      const bNum = Number.parseInt(b.transactionID.replace(/^0+/, ""), 10)
      return bNum - aNum // Descending order
    })

    if (sorted[0] && sorted[0].transactionID) {
      return sorted[0].transactionID
    }

    return null
  }

  // Count pending transactions in IndexedDB
  const countPendingTransactions = async (database) => {
    if (!database) return 0

    try {
      const txCount = await database.count("pendingTransactions")
      const payCount = await database.count("pendingPayments")
      return txCount + payCount
    } catch (error) {
      console.error("Error counting pending transactions:", error)
      return 0
    }
  }

  // Sync data when coming back online
  useEffect(() => {
    if (isOnline && db && pendingCount > 0) {
      syncOfflineData()
    }
  }, [isOnline, db, pendingCount])

  // Function to sync offline data with the server
  const syncOfflineData = async () => {
    if (!db || !isOnline) return

    setSyncStatus("syncing")

    try {
      // Sync pending transactions
      const pendingTxs = await db.getAll("pendingTransactions")

      if (pendingTxs.length > 0) {
        logError("Software", `Syncing ${pendingTxs.length} offline transactions`)

        for (const tx of pendingTxs) {
          try {
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
            const response = await fetch(`${apiUrl}/api/transactions/order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(tx.data),
            })

            if (response.ok) {
              const result = await response.json()

              // Update the last known transaction ID if this is newer
              if (result.transactionID) {
                const currentNumeric = Number.parseInt(lastKnownTransactionID.replace(/^0+/, ""), 10)
                const newNumeric = Number.parseInt(result.transactionID.replace(/^0+/, ""), 10)

                if (newNumeric > currentNumeric) {
                  setLastKnownTransactionID(result.transactionID)
                  // Update in IndexedDB
                  const metaStore = db.transaction("metadata", "readwrite").objectStore("metadata")
                  await metaStore.put({ key: "lastTransactionID", value: result.transactionID })
                }
              }

              // Store the mapping between offline ID and server ID
              await db.put("cachedTransactions", {
                localId: tx.localId,
                offlineTransactionID: tx.offlineTransactionID, // Store the offline ID for reference
                transactionID: result.transactionID,
                ...result,
              })

              // Remove from pending
              await db.delete("pendingTransactions", tx.localId)

              logError(
                "Software",
                `Synced offline transaction ${tx.offlineTransactionID} to server ID ${result.transactionID}`,
              )
            } else {
              throw new Error(`Server returned ${response.status}`)
            }
          } catch (error) {
            logError(
              "Database",
              `Failed to sync transaction ${tx.offlineTransactionID || tx.localId}: ${error.message}`,
            )
            // Keep in pending queue for next sync attempt
          }
        }
      }

      // Sync pending payments
      const pendingPayments = await db.getAll("pendingPayments")

      if (pendingPayments.length > 0) {
        logError("Software", `Syncing ${pendingPayments.length} offline payments`)

        for (const payment of pendingPayments) {
          try {
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
            const response = await fetch(`${apiUrl}/api/transactions/pay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payment.data),
            })

            if (response.ok) {
              // Remove from pending
              await db.delete("pendingPayments", payment.localId)
              logError("Software", `Synced offline payment ${payment.localId}`)
            } else {
              throw new Error(`Server returned ${response.status}`)
            }
          } catch (error) {
            logError("Payment", `Failed to sync payment ${payment.localId}: ${error.message}`)
            // Keep in pending queue for next sync attempt
          }
        }
      }

      // Update pending count
      const newPendingCount = await countPendingTransactions(db)
      setPendingCount(newPendingCount)

      if (newPendingCount === 0) {
        setSyncStatus("completed")
        setSnackbar({
          open: true,
          message: "All offline transactions synced successfully!",
          severity: "success",
        })

        // Refresh transactions list if drawer is open
        if (drawerOpen) {
          fetchTransactions()
        }
      } else {
        setSyncStatus("partial")
        setSnackbar({
          open: true,
          message: `Synced some transactions. ${newPendingCount} still pending.`,
          severity: "warning",
        })
      }
    } catch (error) {
      console.error("Sync error:", error)
      setSyncStatus("failed")
      setSnackbar({
        open: true,
        message: `Sync failed: ${error.message}`,
        severity: "error",
      })
    }
  }

  useEffect(() => {
    setSelectedPaymentMethod(initialPaymentMethod)
  }, [initialPaymentMethod])

  useEffect(() => {
    if (recalledTransaction) {
      logError("Software", `Transaction #${recalledTransaction.transactionID} recalled on component mount`)
    }
  }, [recalledTransaction])

  useEffect(() => {
    // Only activate scanner when drawer is open
    if (!drawerOpen) return

    // Scan state variables
    let buffer = ""
    let lastKeyTime = 0
    const SCANNER_TIMEOUT = 50 // Typical QR scanners send characters very quickly

    // Function to handle keydown events from the scanner
    const handleScan = (event) => {
      // Ignore if it's a modifier key
      if (event.key === "Shift" || event.key === "Control" || event.key === "Alt") {
        return
      }

      const currentTime = new Date().getTime()

      // If there's a significant delay, assume it's a new scan or manual input
      if (currentTime - lastKeyTime > SCANNER_TIMEOUT && buffer.length > 0) {
        console.log("Timeout detected, resetting scan buffer")
        buffer = ""
        setScanBuffer("")
        setScanDebug([])
      }

      lastKeyTime = currentTime

      // Debug: Log each key as it comes in
      console.log(`Key pressed: "${event.key}" (charCode: ${event.key.charCodeAt(0)})`)

      // If Enter key is pressed, process the complete scan
      if (event.key === "Enter") {
        if (buffer) {
          // Log the raw scan buffer for debugging
          console.log("Raw QR Code scanned:", buffer)
          console.log("Raw QR Code length:", buffer.length)

          // Preserve the original transaction ID exactly as scanned
          let transactionID = buffer

          // Check if the transaction ID should have leading zeros but doesn't
          // Most transaction IDs in your system appear to be 6 digits with leading zeros
          if (/^\d+$/.test(transactionID) && transactionID.length < 6) {
            // Pad with leading zeros to make it 6 digits
            const paddedID = transactionID.padStart(6, "0")
            console.log(`Adding leading zeros: "${transactionID}" → "${paddedID}"`)
            transactionID = paddedID
          }

          // Log for debugging
          console.log("Processing transaction ID:", transactionID)

          // Log available transaction IDs for debugging
          console.log(
            "Transactions available:",
            transactions.map((t) => ({
              id: t.transactionID,
              type: typeof t.transactionID,
              stringValue: String(t.transactionID),
            })),
          )

          // Find the transaction with this ID - try exact string match first
          const transaction = transactions.find((t) => {
            // Convert both to strings for consistent comparison
            const transIdStr = String(t.transactionID)

            // Try exact match first (preferred)
            if (transIdStr === transactionID) {
              console.log(`Found exact match: ${transIdStr} = ${transactionID}`)
              return true
            }

            // If database stores IDs without leading zeros, pad them for comparison
            if (/^\d+$/.test(transIdStr) && transIdStr.length < 6) {
              const paddedDbId = transIdStr.padStart(6, "0")
              if (paddedDbId === transactionID) {
                console.log(`Found match after padding database ID: ${transIdStr} → ${paddedDbId} = ${transactionID}`)
                return true
              }
            }

            // If QR code might be scanned without leading zeros but DB has them
            if (transIdStr.length === 6 && /^0+\d+$/.test(transIdStr)) {
              const numericDbId = Number.parseInt(transIdStr, 10).toString()
              if (numericDbId === transactionID) {
                console.log(
                  `Found match by comparing numeric values: ${transIdStr} → ${numericDbId} = ${transactionID}`,
                )
                return true
              }
            }

            return false
          })

          if (transaction) {
            // Don't close the drawer immediately
            // Use setTimeout to ensure this happens after the current render cycle
            setTimeout(() => {
              console.log("Recalling transaction:", transaction)
              const recalledItems = transaction.items.map((item) => ({
                id: item.itemId || item.id,
                name: item.itemName,
                quantity: item.itemQuantity,
                price: item.price || 0,
              }))
              console.log("Mapped recalled items:", recalledItems)
              onClearItems()

              // Navigate to the order page
              navigate("/loop/orders", {
                state: {
                  recalledTransaction: {
                    items: recalledItems,
                    total: transaction.total,
                    paymentMethod: transaction.paymentMethod,
                    transactionID: transaction.transactionID,
                    orderPunched: transaction.orderPunched,
                    paidStatus: transaction.paidStatus,
                    transactionStatus: transaction.transactionStatus,
                  },
                },
              })

              // Close the drawer after successful recall
              setDrawerOpen(false)
              console.log("Drawer closed after recalling transaction")

              logError("Software", `Transaction #${transactionID} recalled via QR scan`)
            }, 0)
          } else {
            setSnackbar({
              open: true,
              message: `Transaction #${transactionID} not found`,
              severity: "error",
            })
            logError("Software", `Transaction #${transactionID} not found when scanned`)
          }
        }
        // Reset buffer after processing
        buffer = ""
        setScanBuffer("")
        setScanDebug([])
      } else {
        // Add character to buffer
        buffer += event.key

        // Update the state for display purposes
        setScanBuffer(buffer)

        // Store debug info
        setScanDebug((prev) => [
          ...prev,
          {
            key: event.key,
            charCode: event.key.charCodeAt(0),
            keyCode: event.keyCode || 0,
            currentBuffer: buffer,
          },
        ])
      }
    }

    // Add event listener
    window.addEventListener("keydown", handleScan)

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleScan)
      setScanBuffer("")
      setScanDebug([])
    }
  }, [drawerOpen, transactions, setDrawerOpen, navigate, onClearItems, setSnackbar, logError])

  console.log("Selected items in OrderSummary:", selectedItems)

  const subtotal = selectedItems.reduce((sum, item) => {
    const price = item.price || 0
    const quantity = item.quantity || 0
    return sum + price * quantity
  }, 0)
  const taxRate = selectedPaymentMethod === "cash" ? 0.15 : 0.05
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const buttonStyle = {
    height: 45,
    fontSize: "0.9rem",
  }

  const createDisabledStyle = (baseColor) => ({
    "&.Mui-disabled": {
      backgroundColor: `${baseColor}4D`,
      color: "rgba(255, 255, 255, 0.5)",
    },
  })

  const fetchTransactions = async (extractLatestID = false) => {
    try {
      setLoadingTransactions(true)
      setTransactionError(null)

      // If offline, load from IndexedDB
      if (!isOnline) {
        if (db) {
          try {
            // Get cached transactions
            const cachedTxs = await db.getAll("cachedTransactions")
            // Filter out the metadata entry
            const filteredTxs = cachedTxs.filter((tx) => tx.transactionID !== "offline_counter")
            setTransactions(filteredTxs)
            logError("Software", "Loaded transactions from offline cache")
          } catch (err) {
            const errorMessage = `Failed to load offline transactions: ${err.message}`
            logError("Database", errorMessage)
            setTransactionError(errorMessage)
          }
        } else {
          setTransactionError("Offline database not available")
        }
        setLoadingTransactions(false)
        return
      }

      // If online, fetch from server
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/transactions/orders`)
      if (!response.ok) {
        const errorMessage = "Failed to fetch transactions"
        logError("Database", `Database connectivity issue: ${errorMessage}`)
        throw new Error(errorMessage)
      }
      const data = await response.json()
      setTransactions(data)

      // Extract latest transaction ID if requested
      if (extractLatestID) {
        const latestID = extractLatestTransactionID(data)
        if (latestID) {
          setLastKnownTransactionID(latestID)
          console.log("Extracted latest transaction ID:", latestID)

          // Update in IndexedDB
          if (db) {
            const metaStore = db.transaction("metadata", "readwrite").objectStore("metadata")
            await metaStore.put({ key: "lastTransactionID", value: latestID })
          }
        }
      }

      // Cache transactions in IndexedDB for offline use
      if (db) {
        try {
          // Use a single transaction for all operations
          const tx = db.transaction("cachedTransactions", "readwrite")
          const store = tx.objectStore("cachedTransactions")

          // Clear existing cache first
          await store.clear()

          // Add each transaction one by one
          for (const transaction of data) {
            // Make sure we have a valid unique key (transactionID)
            if (transaction.transactionID) {
              try {
                // Use put instead of add to avoid key conflicts
                await store.put({
                  ...transaction,
                  // Ensure _id is not undefined if it's used as a key
                  _id: transaction._id || `server_${transaction.transactionID}`,
                  // Add a timestamp for cache management
                  cachedAt: new Date().toISOString(),
                })
              } catch (err) {
                console.warn(`Failed to cache transaction ${transaction.transactionID}:`, err)
                // Continue with the next transaction
              }
            }
          }

          // Wait for the transaction to complete
          await tx.done

          logError("Software", `Cached ${data.length} transactions for offline use`)
        } catch (err) {
          // Log the error but don't fail the whole operation
          console.error("Error caching transactions:", err)
          logError("Database", `Failed to cache transactions: ${err.message}`)
        }
      }

      logError("Software", "Successfully fetched transactions")
    } catch (err) {
      const errorMessage = `Failed to fetch transactions: ${err.message}. Please try again later.`
      logError("Database", `Database connectivity issue: ${err.message}`)
      setTransactionError(errorMessage)
      console.error("Error fetching transactions:", err)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const handleOpenDrawer = () => {
    setDrawerOpen(true)
    fetchTransactions()
    logError("Software", "Opened transaction drawer")
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    logError("Software", "Closed transaction drawer")
  }

  const handleTransactionClick = (transaction) => {
    console.log("Recalling transaction:", transaction)
    const recalledItems = transaction.items.map((item) => ({
      id: item.itemId || item.id,
      name: item.itemName,
      quantity: item.itemQuantity,
      price: item.price || 0,
    }))
    console.log("Mapped recalled items:", recalledItems)
    onClearItems()
    navigate("/loop/orders", {
      state: {
        recalledTransaction: {
          items: recalledItems,
          total: transaction.total,
          paymentMethod: transaction.paymentMethod,
          transactionID: transaction.transactionID,
          orderPunched: transaction.orderPunched,
          paidStatus: transaction.paidStatus,
          transactionStatus: transaction.transactionStatus,
        },
      },
    })
    setDrawerOpen(false)
    logError("Software", `Recalled transaction #${transaction.transactionID}`)
  }

  const handleSendToKitchen = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"

      // Generate a local transaction ID for offline use
      const localId = generateLocalId()
      let transactionID

      // If online, process normally
      if (isOnline) {
        const finishedGoodsResponse = await fetch(`${apiUrl}/api/menu/finishedgoods`)
        if (!finishedGoodsResponse.ok) {
          const errorMessage = "Failed to fetch finished goods data"
          logError("Database", `Database connectivity issue: ${errorMessage}`)
          throw new Error(errorMessage)
        }
        const finishedGoods = await finishedGoodsResponse.json()

        const bomResponse = await fetch(`${apiUrl}/api/menu/bom`)
        if (!bomResponse.ok) {
          const errorMessage = "Failed to fetch BOM data"
          logError("Database", `Database connectivity issue: ${errorMessage}`)
          throw new Error(errorMessage)
        }
        const bomData = await bomResponse.json()

        const updatedBomData = [...bomData]
        const rawIngredientsToReduce = {}

        selectedItems.forEach((item) => {
          const finishedGood = finishedGoods.find((fg) => fg.id === item.id)
          if (finishedGood && finishedGood.rawIngredients && Array.isArray(finishedGood.rawIngredients)) {
            finishedGood.rawIngredients.forEach((ingredient) => {
              const rawId = ingredient.RawID
              const quantityToReduce = ingredient.RawConsume * item.quantity
              rawIngredientsToReduce[rawId] = (rawIngredientsToReduce[rawId] || 0) + quantityToReduce
            })
          }
        })

        updatedBomData.forEach((bomItem) => {
          if (rawIngredientsToReduce[bomItem.RawID]) {
            bomItem.Quantity = Math.max(0, bomItem.Quantity - rawIngredientsToReduce[bomItem.RawID])
          }
        })

        const updateBomResponse = await fetch(`${apiUrl}/api/menu/bom`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBomData),
        })

        if (!updateBomResponse.ok) {
          const errorMessage = (await updateBomResponse.text()).message || "Failed to update BOM"
          logError("Database", `Database connectivity issue: ${errorMessage}`)
          throw new Error(errorMessage)
        }

        const orderData = {
          selectedItems: selectedItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: total,
          selectedPaymentMethod: selectedPaymentMethod,
        }

        const orderResponse = await fetch(`${apiUrl}/api/transactions/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })

        if (!orderResponse.ok) {
          const errorMessage = (await orderResponse.json()).message || "Failed to send order"
          logError("Transaction", `Transaction failed: ${errorMessage}`)
          throw new Error(errorMessage)
        }

        const result = await orderResponse.json()
        if (result.transactionID) {
          transactionID = result.transactionID
          setLatestTransactionID(result.transactionID)

          // Update the last known transaction ID
          setLastKnownTransactionID(result.transactionID)
          if (db) {
            const metaStore = db.transaction("metadata", "readwrite").objectStore("metadata")
            await metaStore.put({ key: "lastTransactionID", value: result.transactionID })
          }

          setSnackbar({
            open: true,
            message: `Order #${result.transactionID} sent to kitchen successfully!`,
            severity: "success",
          })

          logError("Software", `Transaction #${result.transactionID} sent to kitchen`)
        }
      } else {
        // Offline mode - store in IndexedDB
        if (!db) {
          throw new Error("Offline database not available")
        }

        // Generate the next transaction ID based on the last known ID
        transactionID = getNextTransactionID(lastKnownTransactionID)

        // Update the last known ID
        setLastKnownTransactionID(transactionID)
        const metaStore = db.transaction("metadata", "readwrite").objectStore("metadata")
        await metaStore.put({ key: "lastTransactionID", value: transactionID })

        // Format data for storage
        const orderData = {
          selectedItems: selectedItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: total,
          selectedPaymentMethod: selectedPaymentMethod,
          date: new Date().toISOString(),
          transactionID: transactionID, // Include the transaction ID in the data
        }

        // Store in IndexedDB with the formatted offline transaction ID
        await db.add("pendingTransactions", {
          localId,
          offlineTransactionID: transactionID,
          data: orderData,
          createdAt: new Date().toISOString(),
        })

        // Update pending count
        const newPendingCount = await countPendingTransactions(db)
        setPendingCount(newPendingCount)

        setLatestTransactionID(transactionID)

        setSnackbar({
          open: true,
          message: `Order #${transactionID} saved offline. Will sync when online.`,
          severity: "warning",
        })

        logError("Software", `Offline transaction ${transactionID} saved locally`)
      }

      // Generate receipt regardless of online/offline status
      generateDocketSlip({
        selectedItems,
        subtotal,
        tax,
        total,
        transactionID: transactionID,
        paymentMethod: selectedPaymentMethod,
        isOffline: !isOnline,
      })

      logError("Software", `Transaction slip generated for Transaction #${transactionID}`)
      onClearItems()
    } catch (error) {
      console.error("Error:", error)
      logError("Transaction", `Transaction failed: ${error.message}`)
      setError(error.message || "Failed to send order")
      setSnackbar({
        open: true,
        message: error.message || "Failed to send order",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePay = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
      const paymentData = {
        transactionID: recalledTransaction.transactionID,
        total: total,
        paymentMethod: selectedPaymentMethod,
        items: selectedItems,
      }

      // Generate a local ID for this payment
      const localId = generateLocalId()

      if (isOnline) {
        // Online payment processing
        const paymentResponse = await fetch(`${apiUrl}/api/transactions/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        })

        if (!paymentResponse.ok) {
          const errorMessage = "Payment failed"
          logError("Payment", `Payment failed for Transaction #${recalledTransaction.transactionID}: ${errorMessage}`)
          throw new Error(errorMessage)
        }

        setSnackbar({
          open: true,
          message: `Payment for Transaction #${recalledTransaction.transactionID} successful!`,
          severity: "success",
        })

        logError("Software", `Transaction #${recalledTransaction.transactionID} paid successfully`)
      } else {
        // Offline payment processing
        if (!db) {
          throw new Error("Offline database not available")
        }

        // Store payment in IndexedDB for later sync
        await db.add("pendingPayments", {
          localId,
          data: paymentData,
          createdAt: new Date().toISOString(),
        })

        // Update pending count
        const newPendingCount = await countPendingTransactions(db)
        setPendingCount(newPendingCount)

        setSnackbar({
          open: true,
          message: `Payment for Transaction #${recalledTransaction.transactionID} saved offline. Will sync when online.`,
          severity: "warning",
        })

        logError("Software", `Offline payment for Transaction #${recalledTransaction.transactionID} saved locally`)
      }

      generateDocketSlip({
        selectedItems,
        subtotal,
        tax,
        total,
        transactionID: recalledTransaction.transactionID,
        type: "paid",
        paymentMethod: selectedPaymentMethod,
        isOffline: !isOnline,
      })

      logError("Software", `Transaction slip generated for Transaction #${recalledTransaction.transactionID} (Paid)`)

      onClearItems()
      setLatestTransactionID(null)
      setSelectedPaymentMethod(null)
      navigate("/loop/orders", { state: { recalledTransaction: null } })

      logError("Software", "Navigated to orders page after payment")
    } catch (error) {
      console.error("Payment Error:", error)
      logError("Payment", `Payment failed: ${error.message}`)
      setError(error.message || "Failed to process payment")
      setSnackbar({
        open: true,
        message: error.message || "Failed to process payment",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearItems = () => {
    if (selectedItems.length > 0) {
      if (latestTransactionID) {
        logError("Software", `Transaction #${latestTransactionID} suspended (items cleared)`)
      } else {
        logError("Software", "Transaction suspended (items cleared before sending to kitchen)")
      }
    }
    onClearItems()
    setSnackbar({
      open: true,
      message: "All items cleared from order",
      severity: "info",
    })
    logError("Software", "Cleared all items from order")
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return
    setSnackbar({ ...snackbar, open: false })
  }

  // Manual sync button handler
  const handleManualSync = () => {
    if (isOnline && pendingCount > 0) {
      syncOfflineData()
    }
  }

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "600px", lg: "700px" },
        maxWidth: "100%",
        backgroundColor: "#121212",
        color: "white",
        p: { xs: 2, md: 3 },
        borderLeft: { md: "1px solid #333" },
        boxSizing: "border-box",
        overflowX: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Order Details
        {!isOnline && (
          <Typography
            component="span"
            sx={{
              ml: 2,
              color: "#ff9800",
              fontSize: "0.8rem",
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            OFFLINE MODE
          </Typography>
        )}
      </Typography>

      {/* Offline status indicator */}
      {pendingCount > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: isOnline ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 152, 0, 0.1)",
            borderRadius: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: isOnline ? "#4CAF50" : "#ff9800" }}>
            {isOnline
              ? `${pendingCount} transaction${pendingCount !== 1 ? "s" : ""} pending sync`
              : `${pendingCount} transaction${pendingCount !== 1 ? "s" : ""} saved offline`}
          </Typography>
          {isOnline && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleManualSync}
              sx={{
                color: "#4CAF50",
                borderColor: "#4CAF50",
                "&:hover": { borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" },
              }}
            >
              Sync Now
            </Button>
          )}
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Select Payment Method
        </Typography>
        <PaymentMethodSelector selectedMethod={selectedPaymentMethod} onSelectMethod={setSelectedPaymentMethod} />
      </Box>

      {latestTransactionID && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "#1E1E1E",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Typography variant="subtitle1" sx={{ color: "#FFA500" }}>
            {recalledTransaction ? "Recalled Transaction ID" : "Last Transaction ID"}: {latestTransactionID}
          </Typography>
          {recalledTransaction && (
            <>
              <Typography variant="subtitle1" sx={{ color: "#FFA500" }}>
                Order Punched: {recalledTransaction.orderPunched}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#FFA500" }}>
                Paid Status: {recalledTransaction.paidStatus}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#FFA500" }}>
                Transaction Status: {recalledTransaction.transactionStatus}
              </Typography>
            </>
          )}
        </Box>
      )}

      <Paper
        sx={{
          mb: 3,
          overflowX: "hidden",
          // Set a max height that fits about 5 items plus the header
          maxHeight: "250px", // Adjust this value based on your row height
          // Enable vertical scrolling
          overflowY: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: { xs: 500, md: 650 },
            "& .MuiTableCell-root": {
              color: "white",
              borderColor: "#333",
              backgroundColor: "#1E1E1E",
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              padding: { xs: "8px 4px", md: "16px" },
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#252525",
                  zIndex: 1,
                }}
              >
                ITEM
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#252525",
                  zIndex: 1,
                }}
              >
                QUANTITY
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#252525",
                  zIndex: 1,
                }}
              >
                PRICE
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#252525",
                  zIndex: 1,
                }}
              >
                TOTAL
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#252525",
                  zIndex: 1,
                }}
              >
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{(item.price || 0).toFixed(2)}</TableCell>
                <TableCell align="right">{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      onDeleteItem(item.id)
                      logError("Software", `Deleted item ${item.name} from order`)
                    }}
                    sx={{
                      color: "#FF4444",
                      "&:hover": { backgroundColor: "rgba(255, 68, 68, 0.1)" },
                      padding: { xs: 0.5, md: 1 },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {selectedItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No items selected
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {error && (
        <Typography variant="body2" sx={{ color: "#FF4444", mb: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}

      <Box sx={{ textAlign: "right", mb: 3 }}>
        <Typography variant="body1" color="gray">
          Subtotal: <span style={{ color: "#FFA500" }}>{subtotal.toFixed(2)}</span>
        </Typography>
        <Typography variant="body1" color="gray">
          Tax ({taxRate * 100}%): <span style={{ color: "#FFA500" }}>{tax.toFixed(2)}</span>
        </Typography>
        <Typography variant="h6" sx={{ color: "#FFA500", mt: 1 }}>
          Total: {total.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {!recalledTransaction && (
          <Button
            variant="contained"
            sx={{
              ...buttonStyle,
              backgroundColor: "#FFA500",
              ...createDisabledStyle("#FFA500"),
              fontSize: { xs: "0.8rem", md: "0.9rem" },
            }}
            disabled={!selectedPaymentMethod || isLoading || selectedItems.length === 0}
            onClick={handleSendToKitchen}
          >
            {isLoading ? "SENDING..." : !isOnline ? "SAVE ORDER OFFLINE" : "SEND TO KITCHEN"}
          </Button>
        )}
        {recalledTransaction && (
          <Button
            variant="contained"
            sx={{
              ...buttonStyle,
              backgroundColor: "#4CAF50",
              ...createDisabledStyle("#4CAF50"),
              fontSize: { xs: "0.8rem", md: "0.9rem" },
            }}
            disabled={!selectedPaymentMethod || isLoading || selectedItems.length === 0}
            onClick={handlePay}
          >
            {isLoading ? "PROCESSING..." : !isOnline ? "SAVE PAYMENT OFFLINE" : "PAY"}
          </Button>
        )}
        {!recalledTransaction && (
          <Button
            variant="contained"
            sx={{
              ...buttonStyle,
              backgroundColor: "#4CAF50",
              fontSize: { xs: "0.8rem", md: "0.9rem" },
            }}
            onClick={handleOpenDrawer}
          >
            RECALL TRANSACTION
          </Button>
        )}
        <Button
          variant="contained"
          sx={{
            ...buttonStyle,
            backgroundColor: "#FF4444",
            ...createDisabledStyle("#FF4444"),
            fontSize: { xs: "0.8rem", md: "0.9rem" },
          }}
          onClick={handleClearItems}
          disabled={selectedItems.length === 0 || isLoading}
        >
          CLEAR ITEMS
        </Button>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "80%", sm: "60%", md: "50%", lg: "40%" },
            maxWidth: "600px",
            background: "linear-gradient(180deg, #1f1f1f 0%, #252525 100%)",
            color: "white",
            p: { xs: 1, sm: 2 },
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#f15a22",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            Transaction Journal
          </Typography>
          {drawerOpen && (
            <Typography variant="caption" sx={{ color: "#b0b0b0", ml: 1 }}>
              Scan QR code to recall transaction
            </Typography>
          )}
          <Button
            onClick={handleCloseDrawer}
            sx={{
              background: "linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)",
              color: "white",
              padding: { xs: "6px 12px", sm: "8px 16px" },
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Close
          </Button>
        </Box>

        {/* Network status indicator for drawer */}
        {!isOnline && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: "rgba(255, 152, 0, 0.1)", borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: "#ff9800" }}>
              You are currently offline. Showing cached transactions.
            </Typography>
          </Box>
        )}

        {/* Debug info for scanning */}
        {scanBuffer && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: "#2a2a2a", borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: "#f15a22" }}>
              Scanning: {scanBuffer}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {scanDebug.map((item, index) => (
                <Typography key={index} variant="caption" sx={{ display: "block", color: "#b0b0b0" }}>
                  Key: {item.key}, CharCode: {item.charCode}, KeyCode: {item.keyCode}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {loadingTransactions ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <CircularProgress sx={{ color: "#f15a22" }} />
            <Typography sx={{ color: "white", ml: 2 }}>Loading transactions...</Typography>
          </Box>
        ) : transactionError ? (
          <Box sx={{ textAlign: "center", py: 4, flex: 1 }}>
            <Typography sx={{ color: "#ff4d4d", fontWeight: "bold", mb: 2 }}>{transactionError}</Typography>
            <Button
              onClick={fetchTransactions}
              sx={{
                background: "linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)",
                color: "white",
                padding: { xs: "6px 20px", sm: "8px 24px" },
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)",
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Retry
            </Button>
          </Box>
        ) : transactions.length === 0 ? (
          <Typography sx={{ color: "#b0b0b0", textAlign: "center", py: 4, flex: 1 }}>No transactions found.</Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                background: "#2a2a2a",
                padding: { xs: 1, sm: 1.5 },
                borderRadius: "8px",
                border: "1px solid #444",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                color: "#f15a22",
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              <Typography sx={{ flex: 1 }}>Transaction #</Typography>
              <Typography sx={{ flex: 1, textAlign: "center" }}>Total</Typography>
              <Typography sx={{ flex: 1, textAlign: "right" }}>Date</Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                maxHeight: "100%",
              }}
            >
              {transactions.map((transaction) => (
                <Box
                  key={transaction._id || transaction.transactionID}
                  onClick={() => handleTransactionClick(transaction)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#2a2a2a",
                    padding: { xs: 1, sm: 1.5 },
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    border: "1px solid #444",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease",
                    mb: 1,
                    "&:hover": {
                      background: "linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                    },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  <Typography sx={{ flex: 1, fontWeight: "bold" }}>
                    #{transaction.transactionID}
                    {transaction.localId && !isOnline && (
                      <Typography component="span" sx={{ ml: 1, fontSize: "0.7rem", color: "#ff9800" }}>
                        (offline)
                      </Typography>
                    )}
                  </Typography>
                  <Typography sx={{ flex: 1, textAlign: "center" }}>${transaction.total.toFixed(2)}</Typography>
                  <Typography sx={{ flex: 1, textAlign: "right", color: "#b0b0b0" }}>
                    {new Date(transaction.date).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default OrderSummary
