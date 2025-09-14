"use client"

import { useState, useCallback } from "react"

interface Transaction {
  hash: string
  status: "pending" | "success" | "failed"
  timestamp: Date
  ethAmount: string
  tokenAmount: string
  blockNumber?: number
}

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const addTransaction = useCallback((tx: Omit<Transaction, "timestamp">) => {
    const newTransaction: Transaction = {
      ...tx,
      timestamp: new Date(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }, [])

  const updateTransactionStatus = useCallback((hash: string, status: Transaction["status"], blockNumber?: number) => {
    setTransactions((prev) => prev.map((tx) => (tx.hash === hash ? { ...tx, status, blockNumber } : tx)))
  }, [])

  const clearTransactions = useCallback(() => {
    setTransactions([])
  }, [])

  return {
    transactions,
    addTransaction,
    updateTransactionStatus,
    clearTransactions,
  }
}
