"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDark(savedTheme === "dark" || (!savedTheme && systemDark))
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", isDark)
      localStorage.setItem("theme", isDark ? "dark" : "light")
    }
  }, [isDark, mounted])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {isDark ? "☀️" : "🌙"}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
