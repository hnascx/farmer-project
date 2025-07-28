"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

export function Logo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Image
      src={
        theme === "dark" ? "/violet-logo-dark.svg" : "/violet-logo-light.svg"
      }
      alt="Violet Logo"
      width={120}
      height={32}
      priority
      className="transition-all duration-200"
    />
  )
}
