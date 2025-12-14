import Link from 'next/link';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
            Blockchain Certificate
            <br />
            Verification System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Secure, transparent, and tamper-proof certificate issuance and verification on
            Ethereum, Base, and Solana blockchains.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/issue" className="btn-primary text-lg px-8 py-3">
              Issue Certificate
            </Link>
            <Link href="/verify" className="btn-secondary text-lg px-8 py-3">
              Verify Certificate
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up">
          <div className="card">
            <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
            <div className="text-gray-600 dark:text-gray-400">Tamper-Proof</div>
          </div>
          <div className="card">
            <div className="text-4xl font-bold text-primary-600 mb-2">3</div>
            <div className="text-gray-600 dark:text-gray-400">Blockchain Networks</div>
          </div>
          <div className="card">
            <div className="text-4xl font-bold text-primary-600 mb-2">∞</div>
            <div className="text-gray-600 dark:text-gray-400">Permanent Storage</div>
          </div>
        </div>
      </div>
    </section>
  );
}
