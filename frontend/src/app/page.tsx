import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Praman
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/verify" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Verify
              </Link>
              <Link href="/issue" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Issue
              </Link>
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join institutions worldwide in issuing tamper-proof, verifiable certificates on the blockchain.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/issue"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
            >
              Issue Certificate
            </Link>
            <Link
              href="/verify"
              className="btn-secondary bg-primary-700 text-white hover:bg-primary-800"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Praman</h3>
              <p className="text-gray-400">
                Secure, transparent, and decentralized certificate verification.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/verify" className="hover:text-white">Verify</Link></li>
                <li><Link href="/issue" className="hover:text-white">Issue</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Blockchain</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Ethereum</li>
                <li>Base</li>
                <li>Solana</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Praman. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
