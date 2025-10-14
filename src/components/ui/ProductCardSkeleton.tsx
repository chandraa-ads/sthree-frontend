import React from 'react'
import { motion } from 'framer-motion'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-[3/4] bg-gray-200">
        <motion.div
          animate={{ x: [-100, 400] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4">
            <motion.div
              animate={{ x: [-100, 200] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-transparent via-white/60 to-transparent rounded"
            />
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/2">
            <motion.div
              animate={{ x: [-100, 150] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-transparent via-white/60 to-transparent rounded"
            />
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
          ))}
          <div className="h-3 bg-gray-200 rounded w-12 ml-2" />
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-20">
            <motion.div
              animate={{ x: [-50, 100] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.4 }}
              className="h-full bg-gradient-to-r from-transparent via-white/60 to-transparent rounded"
            />
          </div>
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        
        {/* Category badge */}
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
    </div>
  )
}