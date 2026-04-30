// app/playground/backtesting-engine/constants/exchanges.ts

import type { Exchange, ExchangeMeta } from "../types"


export const EXCHANGES: Record<Exchange, ExchangeMeta> = {
  NSE: {
    label: 'NSE — National Stock Exchange of India',
    currency: '₹',
    sampleStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
      { symbol: 'TCS',      name: 'Tata Consultancy Services' },
      { symbol: 'INFY',     name: 'Infosys' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK',name: 'ICICI Bank' },
      { symbol: 'SBIN',     name: 'State Bank of India' },
      { symbol: 'WIPRO',    name: 'Wipro' },
      { symbol: 'AXISBANK', name: 'Axis Bank' },
      { symbol: '^NSEI',    name: 'Nifty 50 Index' },
      { symbol: '^BSESN',   name: 'Sensex' },
    ],
  },
  BSE: {
    label: 'BSE — Bombay Stock Exchange',
    currency: '₹',
    sampleStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
      { symbol: 'TCS',      name: 'Tata Consultancy Services' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'INFY',     name: 'Infosys' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance' },
    ],
  },
  NYSE: {
    label: 'NYSE — New York Stock Exchange',
    currency: '$',
    sampleStocks: [
      { symbol: 'BRK-B', name: 'Berkshire Hathaway B' },
      { symbol: 'JPM',   name: 'JPMorgan Chase' },
      { symbol: 'BAC',   name: 'Bank of America' },
      { symbol: 'WMT',   name: 'Walmart' },
      { symbol: 'XOM',   name: 'ExxonMobil' },
      { symbol: 'KO',    name: 'Coca-Cola' },
      { symbol: 'DIS',   name: 'Walt Disney' },
      { symbol: 'GE',    name: 'General Electric' },
    ],
  },
  NASDAQ: {
    label: 'NASDAQ',
    currency: '$',
    sampleStocks: [
      { symbol: 'AAPL',  name: 'Apple' },
      { symbol: 'MSFT',  name: 'Microsoft' },
      { symbol: 'GOOGL', name: 'Alphabet' },
      { symbol: 'AMZN',  name: 'Amazon' },
      { symbol: 'NVDA',  name: 'NVIDIA' },
      { symbol: 'META',  name: 'Meta Platforms' },
      { symbol: 'TSLA',  name: 'Tesla' },
      { symbol: 'AMD',   name: 'AMD' },
      { symbol: '^IXIC', name: 'NASDAQ Composite' },
    ],
  },
  LSE: {
    label: 'LSE — London Stock Exchange',
    currency: '£',
    sampleStocks: [
      { symbol: 'SHEL',  name: 'Shell' },
      { symbol: 'AZN',   name: 'AstraZeneca' },
      { symbol: 'HSBA',  name: 'HSBC Holdings' },
      { symbol: 'BP',    name: 'BP' },
      { symbol: 'ULVR',  name: 'Unilever' },
      { symbol: '^FTSE', name: 'FTSE 100' },
    ],
  },
  SSE: {
    label: 'SSE — Shanghai Stock Exchange',
    currency: '¥',
    sampleStocks: [
      { symbol: '600519', name: 'Kweichow Moutai' },
      { symbol: '601318', name: 'Ping An Insurance' },
      { symbol: '600036', name: 'China Merchants Bank' },
      { symbol: '600900', name: 'Yangtze Power' },
      { symbol: '^SSEC',  name: 'Shanghai Composite' },
    ],
  },
}