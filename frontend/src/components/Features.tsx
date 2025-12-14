export function Features() {
  const features = [
    {
      icon: '🔒',
      title: 'Tamper-Proof',
      description: 'Certificates stored on blockchain are immutable and cannot be altered or forged.',
    },
    {
      icon: '⚡',
      title: 'Instant Verification',
      description: 'Verify certificates in seconds using QR codes or certificate IDs.',
    },
    {
      icon: '🌐',
      title: 'Multi-Chain Support',
      description: 'Deploy on Ethereum, Base, or Solana based on your needs.',
    },
    {
      icon: '🔍',
      title: 'Transparent',
      description: 'All certificate transactions are publicly verifiable on the blockchain.',
    },
    {
      icon: '💾',
      title: 'Permanent Storage',
      description: 'Certificates are stored permanently on the blockchain, accessible anytime.',
    },
    {
      icon: '🚀',
      title: 'Easy Integration',
      description: 'Simple APIs and tools for institutions to integrate certificate issuance.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Praman?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built with cutting-edge blockchain technology to ensure security, transparency, and
            efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-xl transition-shadow duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
