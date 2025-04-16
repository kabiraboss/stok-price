import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for multiple companies
const companiesData = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 178.32,
    priceChange: 2.45,
    priceChangePercentage: 1.39,
    ipoDate: '1980-12-12',
    ipoPrice: 22.00,
    marketCap: '2.85T',
    volume: '52.3M',
    prices: Array.from({ length: 30 }, (_, i) => ({
      date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
      price: 170 + Math.random() * 20,
      volume: Math.floor(Math.random() * 1000000)
    }))
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 415.50,
    priceChange: -3.25,
    priceChangePercentage: -0.78,
    ipoDate: '1986-03-13',
    ipoPrice: 21.00,
    marketCap: '3.1T',
    volume: '48.7M',
    prices: Array.from({ length: 30 }, (_, i) => ({
      date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
      price: 400 + Math.random() * 30,
      volume: Math.floor(Math.random() * 1000000)
    }))
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 147.75,
    priceChange: 1.85,
    priceChangePercentage: 1.27,
    ipoDate: '2004-08-19',
    ipoPrice: 85.00,
    marketCap: '1.85T',
    volume: '35.2M',
    prices: Array.from({ length: 30 }, (_, i) => ({
      date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
      price: 140 + Math.random() * 15,
      volume: Math.floor(Math.random() * 1000000)
    }))
  }
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeRange, setTimeRange] = useState('1M');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [chartType, setChartType] = useState<'price' | 'volume'>('price');

  const stockData = companiesData[selectedStock];

  const themeClass = isDarkMode ? 'dark' : '';
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textColorSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const priceChartData = {
    labels: stockData.prices.map(item => item.date),
    datasets: [
      {
        label: stockData.symbol,
        data: stockData.prices.map(item => item.price),
        borderColor: isDarkMode ? 'rgb(134, 239, 172)' : 'rgb(75, 192, 192)',
        backgroundColor: isDarkMode ? 'rgba(134, 239, 172, 0.1)' : 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        fill: true,
      }
    ]
  };

  const volumeChartData = {
    labels: stockData.prices.map(item => item.date),
    datasets: [
      {
        label: 'Volume',
        data: stockData.prices.map(item => item.volume),
        backgroundColor: isDarkMode ? 'rgba(134, 239, 172, 0.5)' : 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number) => chartType === 'price' ? `$${value.toFixed(2)}` : `${(value/1000000).toFixed(1)}M`,
          color: isDarkMode ? '#9CA3AF' : '#4B5563',
        },
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#4B5563',
        },
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
        },
      },
    },
  };

  const ipoReturn = ((stockData.currentPrice - stockData.ipoPrice) / stockData.ipoPrice * 100).toFixed(2);

  return (
    <div className={`min-h-screen ${bgColor} p-6 transition-colors duration-200 ${themeClass}`}>
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className={`${cardBg} ${textColor} px-4 py-2 rounded-lg appearance-none pr-10 cursor-pointer`}
            >
              {Object.keys(companiesData).map((symbol) => (
                <option key={symbol} value={symbol}>{companiesData[symbol].name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2" size={16} />
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${cardBg} p-2 rounded-lg`}
          >
            {isDarkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-600" />}
          </button>
        </div>

        {/* Header */}
        <div className={`${cardBg} rounded-xl shadow-sm p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${textColor}`}>{stockData.name}</h1>
              <p className={textColorSecondary}>{stockData.symbol}</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${textColor}`}>${stockData.currentPrice}</p>
              <div className={`flex items-center justify-end ${stockData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stockData.priceChange >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                <span className="ml-1">${Math.abs(stockData.priceChange)} ({stockData.priceChangePercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center">
              <DollarSign className="text-blue-500" size={24} />
              <h3 className={`ml-2 ${textColorSecondary}`}>Market Cap</h3>
            </div>
            <p className={`mt-2 text-2xl font-semibold ${textColor}`}>{stockData.marketCap}</p>
          </div>
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center">
              <Activity className="text-purple-500" size={24} />
              <h3 className={`ml-2 ${textColorSecondary}`}>Volume</h3>
            </div>
            <p className={`mt-2 text-2xl font-semibold ${textColor}`}>{stockData.volume}</p>
          </div>
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center">
              <Calendar className="text-green-500" size={24} />
              <h3 className={`ml-2 ${textColorSecondary}`}>IPO Date</h3>
            </div>
            <p className={`mt-2 text-2xl font-semibold ${textColor}`}>{stockData.ipoDate}</p>
          </div>
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center">
              <TrendingUp className="text-red-500" size={24} />
              <h3 className={`ml-2 ${textColorSecondary}`}>IPO Return</h3>
            </div>
            <p className="mt-2 text-2xl font-semibold text-green-500">+{ipoReturn}%</p>
          </div>
        </div>

        {/* Chart */}
        <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className={`text-xl font-semibold ${textColor}`}>
                {chartType === 'price' ? 'Price History' : 'Volume Analysis'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('price')}
                  className={`px-3 py-1 rounded ${
                    chartType === 'price'
                      ? 'bg-blue-500 text-white'
                      : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${textColorSecondary} hover:bg-opacity-80`
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => setChartType('volume')}
                  className={`px-3 py-1 rounded ${
                    chartType === 'volume'
                      ? 'bg-blue-500 text-white'
                      : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${textColorSecondary} hover:bg-opacity-80`
                  }`}
                >
                  Volume
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${textColorSecondary} hover:bg-opacity-80`
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px]">
            {chartType === 'price' ? (
              <Line data={priceChartData} options={chartOptions} />
            ) : (
              <Bar data={volumeChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* IPO Analysis */}
        <div className={`${cardBg} rounded-xl shadow-sm p-6 mt-6`}>
          <h2 className={`text-xl font-semibold ${textColor} mb-4`}>IPO Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <h3 className={textColorSecondary}>IPO Price</h3>
              <p className={`text-2xl font-semibold ${textColor}`}>${stockData.ipoPrice}</p>
            </div>
            <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <h3 className={textColorSecondary}>Current Value of $10,000 IPO Investment</h3>
              <p className="text-2xl font-semibold text-green-500">
                ${((10000 / stockData.ipoPrice) * stockData.currentPrice).toFixed(2)}
              </p>
            </div>
            <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <h3 className={textColorSecondary}>Years Since IPO</h3>
              <p className={`text-2xl font-semibold ${textColor}`}>
                {new Date().getFullYear() - new Date(stockData.ipoDate).getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;