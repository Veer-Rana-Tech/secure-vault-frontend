import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
          <motion.div
            className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-red-200/25 border border-white/50 p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-exclamation-triangle text-red-600 text-2xl"></i>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h2>

            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. This has been logged and we're working to fix it.
            </p>

             <div className="space-y-3">
               <button
                 onClick={() => window.location.reload()}
                 className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/30 font-medium"
               >
                 <i className="bi bi-arrow-clockwise me-2"></i>
                 Reload Page
               </button>

               <button
                 onClick={() => window.location.href = '/'}
                 className="w-full px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 hover:scale-105 transition-all duration-200 shadow-lg shadow-gray-500/30 font-medium"
               >
                 <i className="bi bi-house me-2"></i>
                 Go Home
               </button>
             </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;