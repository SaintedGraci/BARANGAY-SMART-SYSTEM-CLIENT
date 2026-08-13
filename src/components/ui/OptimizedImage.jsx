import React, { useState } from 'react';

/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component that implements:
 * - Native lazy loading (loading="lazy")
 * - Async decoding to prevent render blocking (decoding="async")
 * - Loading state with skeleton placeholder
 * - Error handling with fallback
 * - Responsive image loading
 * 
 * @param {string} src - Image URL (required)
 * @param {string} alt - Alt text for accessibility (required)
 * @param {string} className - Additional CSS classes
 * @param {string} width - Image width
 * @param {string} height - Image height
 * @param {React.ReactNode} fallback - Custom fallback component on error
 * @param {boolean} eager - Disable lazy loading for above-the-fold images
 * @param {Function} onLoad - Callback when image loads
 * @param {Function} onError - Callback when image fails to load
 */
const OptimizedImage = ({
    src,
    alt,
    className = '',
    width,
    height,
    fallback,
    eager = false,
    onLoad,
    onError,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = (e) => {
        setIsLoading(false);
        if (onLoad) onLoad(e);
    };

    const handleError = (e) => {
        setIsLoading(false);
        setHasError(true);
        console.error('Image failed to load:', src);
        if (onError) onError(e);
    };

    // Show fallback if error occurred
    if (hasError) {
        if (fallback) {
            return fallback;
        }
        
        return (
            <div 
                className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
                style={{ width, height }}
            >
                <svg 
                    className="w-12 h-12" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                </svg>
            </div>
        );
    }

    return (
        <div className="relative" style={{ width, height }}>
            {/* Loading skeleton */}
            {isLoading && (
                <div 
                    className={`absolute inset-0 bg-slate-200 animate-pulse ${className}`}
                    style={{ width, height }}
                />
            )}

            {/* Optimized image with lazy loading and async decoding */}
            <img
                src={src}
                alt={alt}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                width={width}
                height={height}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
