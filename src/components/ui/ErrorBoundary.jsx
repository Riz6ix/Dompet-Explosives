/**
 * ErrorBoundary.jsx
 * Mencegah aplikasi "White Screen" saat terjadi error fatal
 * Menampilkan pesan error yang ramah + tombol reload
 */

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border-t-8 border-red-500 animate-fade-in-up">
            {/* Icon Error */}
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Pesan User */}
            <h1 className="text-2xl font-black text-gray-800 mb-3 text-center">
              Oops! Terjadi Kesalahan
            </h1>
            <p className="text-gray-600 mb-8 text-center leading-relaxed">
              Aplikasi mengalami masalah teknis. Jangan khawatir,
              <strong className="text-gray-800">
                {" "}
                data Anda aman
              </strong>{" "}
              di penyimpanan browser.
            </p>

            {/* Detail Error (Untuk Developer) */}
            <div className="bg-gray-900 rounded-lg p-4 mb-8 text-left overflow-auto max-h-40 border border-gray-700 shadow-inner">
              <p className="text-xs font-mono text-red-400 font-bold mb-2">
                Error Details:
              </p>
              <code className="text-xs font-mono text-gray-300 block break-words">
                {this.state.error && this.state.error.toString()}
              </code>
            </div>

            {/* Tombol Reload */}
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
