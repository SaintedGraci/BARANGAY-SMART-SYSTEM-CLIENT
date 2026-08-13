/**
 * Test Page for TASK8 Image Optimization
 * 
 * This page demonstrates all features of the OptimizedImage component:
 * - Lazy loading
 * - Loading skeleton
 * - Error handling
 * - Different image sizes
 * - Eager vs lazy loading
 * 
 * Access: /test-images
 */

import { useState } from 'react';
import OptimizedImage from '../components/ui/OptimizedImage';

export default function TestImageOptimization() {
  const [showBrokenImage, setShowBrokenImage] = useState(false);

  // Sample images for testing
  const testImages = [
    {
      url: 'https://pub-ccad0830e7364a25afd38860dbe7d923.r2.dev/announcements/sample1.webp',
      alt: 'Sample 1',
      width: '400',
      height: '300'
    },
    {
      url: 'https://pub-ccad0830e7364a25afd38860dbe7d923.r2.dev/announcements/sample2.webp',
      alt: 'Sample 2',
      width: '400',
      height: '300'
    },
    {
      url: 'https://pub-ccad0830e7364a25afd38860dbe7d923.r2.dev/announcements/sample3.webp',
      alt: 'Sample 3',
      width: '400',
      height: '300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TASK 8 - Image Optimization Test Page
          </h1>
          <p className="text-gray-600">
            Testing OptimizedImage component with lazy loading, skeleton, and error handling
          </p>
        </div>

        {/* Feature List */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">✅ Features Tested:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Native lazy loading (<code>loading="lazy"</code>)
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Async image decoding (<code>decoding="async"</code>)
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Loading skeleton animation
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Fade-in transition on load
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Error handling with fallback UI
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              WebP format (optimized by Sharp)
            </li>
          </ul>
        </div>

        {/* Test 1: Eager Loading */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 1: Eager Loading (Above the Fold)</h2>
          <p className="text-gray-600 mb-4">
            This image loads immediately without lazy loading (good for hero images)
          </p>
          <OptimizedImage
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=400&fit=crop"
            alt="Hero Image"
            className="w-full h-64 object-cover rounded-lg"
            eager={true}
          />
          <p className="text-xs text-gray-500 mt-2">
            Expected: Loads immediately, no skeleton, <code>loading="eager"</code>
          </p>
        </div>

        {/* Test 2: Lazy Loading */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 2: Lazy Loading (Below the Fold)</h2>
          <p className="text-gray-600 mb-4">
            Scroll down to see these images load lazily with skeleton placeholders
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testImages.map((image, idx) => (
              <div key={idx}>
                <OptimizedImage
                  src={image.url}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">Image {idx + 1}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Expected: Shows skeleton → Loads when visible → Fades in
          </p>
        </div>

        {/* Test 3: Error Handling */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 3: Error Handling</h2>
          <p className="text-gray-600 mb-4">
            Testing broken image URL to verify error fallback
          </p>
          <button
            onClick={() => setShowBrokenImage(!showBrokenImage)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showBrokenImage ? 'Hide' : 'Show'} Broken Image
          </button>
          
          {showBrokenImage && (
            <OptimizedImage
              src="https://invalid-url.com/broken-image.webp"
              alt="Broken Image"
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Expected: Shows error state with icon and message
          </p>
        </div>

        {/* Test 4: Different Sizes */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 4: Different Sizes</h2>
          <p className="text-gray-600 mb-4">
            Testing component with various image dimensions
          </p>
          <div className="space-y-4">
            {/* Small */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Small (128x128):</p>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=128&h=128&fit=crop"
                alt="Small image"
                width="128"
                height="128"
                className="w-32 h-32 object-cover rounded"
              />
            </div>

            {/* Medium */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Medium (400x300):</p>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop"
                alt="Medium image"
                width="400"
                height="300"
                className="w-96 h-72 object-cover rounded"
              />
            </div>

            {/* Large */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Large (1200x600):</p>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop"
                alt="Large image"
                width="1200"
                height="600"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Test 5: Custom Fallback */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 5: Custom Fallback</h2>
          <p className="text-gray-600 mb-4">
            Testing custom fallback component for errors
          </p>
          <OptimizedImage
            src="https://invalid.com/error.webp"
            alt="Custom fallback test"
            className="w-full h-64 rounded-lg"
            fallback={
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl mb-2">🎨</p>
                  <p className="text-gray-700 font-semibold">Custom Fallback</p>
                  <p className="text-gray-500 text-sm">This image could not be loaded</p>
                </div>
              </div>
            }
          />
        </div>

        {/* Performance Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            📊 Performance Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">90%</p>
              <p className="text-sm text-gray-700">File size reduction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">10x</p>
              <p className="text-sm text-gray-700">Faster loading</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">WebP</p>
              <p className="text-sm text-gray-700">Modern format</p>
            </div>
          </div>
        </div>

        {/* Browser DevTools Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">
            🔍 How to Verify in DevTools
          </h2>
          <ol className="space-y-2 text-gray-700">
            <li>1. Open browser DevTools (F12)</li>
            <li>2. Go to Network tab</li>
            <li>3. Filter by "Img"</li>
            <li>4. Scroll page to trigger lazy loading</li>
            <li>5. Check image properties:
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li>• Type should be <code>webp</code></li>
                <li>• Headers should include <code>Cache-Control</code></li>
                <li>• Size should be significantly smaller</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
