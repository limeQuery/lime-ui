
import React, { Suspense } from "react"

/**
 * @param {React.LazyExoticComponent} Component
 * @param {React.ReactNode} fallback 
 * @returns {React.ReactNode}
 */
export function withSuspense(Component, fallback = "") {
  return () => <Suspense fallback={fallback} children={<Component />} />
}