const config = {
  api: {
    baseUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
    timeout: 10000,
  },
  environment: process.env.REACT_APP_ENV || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  supportedChains: {
    avalanche: {
      name: 'Avalanche',
      symbol: 'AVAX',
      logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg'
    },
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      logo: 'https://assets.coingecko.com/coins/images/4713/standard/polygon.png'
    },
    celo: {
      name: 'Celo',
      symbol: 'CELO',
      logo: 'https://assets.coingecko.com/coins/images/11090/standard/InjXBNx9_400x400.jpg'
    }
  }
};

export default config; 