import React, { useState, useEffect, useRef } from 'react';

/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component that implements:
 * - Native lazy loading (loading="lazy")
 * - Async decoding to prevent render blocking (decoding="async")
 * - Progressive loading with blur-up effect
 * - Responsive images with srcSet
 * - IntersectionObserver for better lazy loading control
 * - Loading state with skeleton placeholder
 * - Error handling with fallback
 * - Image caching optimization
 * 
 * @param {string} src - Image URL (required)
 * @param {string} srcSet - Responsive image srcSet
 * @param {string} sizes - Responsive image sizes
 * @param {string} alt - Alt text for accessibility (required)
 * @param {string} className - Additional CSS classes
 * @param {string} width - Image width
 * @param {string} height - Image height
 * @param {React.ReactNode} fallback - Custom fallback component on error
 * @param {boolean} eager - Disable lazy loading for above-the-fold images
 * @param {Function} onLoad - Callback when image loads
 * @param {Function} onError - Callback when image fails to load
 * @param {boolean} progressive - Enable progressive blur-up loading (default: true)
 * @param {boolean} useIntersectionObserver - Use custom intersection observer (default: false, uses native lazy)
 */
const OptimizedImage = ({
    src,
    srcSet,
    sizes,
    alt,
    className = '',
    width,
    height,
    fallback,
    eager = false,
    onLoad,
    onError,
    progressive = true,
    useIntersectionObserver = false,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(eager ? src : null);
    const [imageSrcSet, setImageSrcSet] = useState(eager ? srcSet : null);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    // Custom IntersectionObserver for more control over lazy loading
    useEffect(() => {
        if (!useIntersectionObserver || eager || !src) return;

        const options = {
            root: null,
            rootMargin: '50px', // Start loading 50px before visible
            threshold: 0.01,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !imageSrc) {
                    // Load image when it's about to be visible
                    setImageSrc(src);
                    setImageSrcSet(srcSet);
                    
                    // Disconnect observer after loading
                    if (observerRef.current && imgRef.current) {
                        observerRef.current.unobserve(imgRef.current);
                    }
                }
            });
        }, options);

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [src, srcSet, eager, imageSrc, useIntersectionObserver]);

    // Preload image in background for faster perceived loading (for eager images)
    useEffect(() => {
        if (!src || !eager) return;

        const img = new Image();
        img.src = src;
        if (srcSet) img.srcset = srcSet;
        
        // Set source immediately for better UX
        setImageSrc(src);
        setImageSrcSet(srcSet);

        // Image is already cached or loads fast
        if (img.complete) {
            setIsLoading(false);
        }
    }, [src, srcSet, eager]);

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
        <div ref={imgRef} className="relative" style={{ width, height }}>
            {/* Loading skeleton with shimmer effect */}
            {isLoading && progressive && (
                <div 
                    className={`absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer ${className}`}
                    style={{ 
                        width, 
                        height,
                        backgroundSize: '200% 100%',
                    }}
                />
            )}

            {/* Optimized image with lazy loading, async decoding, responsive images, and caching */}
            {(imageSrc || !useIntersectionObserver) && (
                <img
                    src={imageSrc || src}
                    srcSet={imageSrcSet || srcSet}
                    sizes={sizes}
                    alt={alt}
                    className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    width={width}
                    height={height}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    // Add fetchpriority for above-the-fold images
                    fetchpriority={eager ? 'high' : 'auto'}
                    // Enable browser caching
                    crossOrigin="anonymous"
                    {...props}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
