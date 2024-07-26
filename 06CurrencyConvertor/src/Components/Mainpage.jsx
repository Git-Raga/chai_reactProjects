import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const currencyCountryMap = {
  AED: 'ae',
  AFN: 'af',
  ALL: 'al',
  AMD: 'am',
  ANG: 'nl',
  AOA: 'ao',
  ARS: 'ar',
  AUD: 'au',
  AWG: 'aw',
  AZN: 'az',
  BAM: 'ba',
  BBD: 'bb',
  BDT: 'bd',
  BGN: 'bg',
  BHD: 'bh',
  BIF: 'bi',
  BMD: 'bm',
  BND: 'bn',
  BOB: 'bo',
  BRL: 'br',
  BSD: 'bs',
  BTN: 'bt',
  BWP: 'bw',
  BYN: 'by',
  BZD: 'bz',
  CAD: 'ca',
  CDF: 'cd',
  CHF: 'ch',
  CLP: 'cl',
  CNY: 'cn',
  COP: 'co',
  CRC: 'cr',
  CUP: 'cu',
  CVE: 'cv',
  CZK: 'cz',
  DJF: 'dj',
  DKK: 'dk',
  DOP: 'do',
  DZD: 'dz',
  EGP: 'eg',
  ERN: 'er',
  ETB: 'et',
  EUR: 'eu',
  FJD: 'fj',
  FKP: 'fk',
  FOK: 'fo',
  GBP: 'gb',
  GEL: 'ge',
  GGP: 'gg',
  GHS: 'gh',
  GIP: 'gi',
  GMD: 'gm',
  GNF: 'gn',
  GTQ: 'gt',
  GYD: 'gy',
  HKD: 'hk',
  HNL: 'hn',
  HRK: 'hr',
  HTG: 'ht',
  HUF: 'hu',
  IDR: 'id',
  ILS: 'il',
  IMP: 'im',
  INR: 'in',
  IQD: 'iq',
  IRR: 'ir',
  ISK: 'is',
  JEP: 'je',
  JMD: 'jm',
  JOD: 'jo',
  JPY: 'jp',
  KES: 'ke',
  KGS: 'kg',
  KHR: 'kh',
  KID: 'ki',
  KMF: 'km',
  KRW: 'kr',
  KWD: 'kw',
  KYD: 'ky',
  KZT: 'kz',
  LAK: 'la',
  LBP: 'lb',
  LKR: 'lk',
  LRD: 'lr',
  LSL: 'ls',
  LYD: 'ly',
  MAD: 'ma',
  MDL: 'md',
  MGA: 'mg',
  MKD: 'mk',
  MMK: 'mm',
  MNT: 'mn',
  MOP: 'mo',
  MRU: 'mr',
  MUR: 'mu',
  MVR: 'mv',
  MWK: 'mw',
  MXN: 'mx',
  MYR: 'my',
  MZN: 'mz',
  NAD: 'na',
  NGN: 'ng',
  NIO: 'ni',
  NOK: 'no',
  NPR: 'np',
  NZD: 'nz',
  OMR: 'om',
  PAB: 'pa',
  PEN: 'pe',
  PGK: 'pg',
  PHP: 'ph',
  PKR: 'pk',
  PLN: 'pl',
  PYG: 'py',
  QAR: 'qa',
  RON: 'ro',
  RSD: 'rs',
  RUB: 'ru',
  RWF: 'rw',
  SAR: 'sa',
  SBD: 'sb',
  SCR: 'sc',
  SDG: 'sd',
  SEK: 'se',
  SGD: 'sg',
  SHP: 'sh',
  SLL: 'sl',
  SOS: 'so',
  SRD: 'sr',
  SSP: 'ss',
  STN: 'st',
  SYP: 'sy',
  SZL: 'sz',
  THB: 'th',
  TJS: 'tj',
  TMT: 'tm',
  TND: 'tn',
  TOP: 'to',
  TRY: 'tr',
  TTD: 'tt',
  TVD: 'tv',
  TWD: 'tw',
  TZS: 'tz',
  UAH: 'ua',
  UGX: 'ug',
  USD: 'us',
  UYU: 'uy',
  UZS: 'uz',
  VES: 've',
  VND: 'vn',
  VUV: 'vu',
  WST: 'ws',
  XAF: 'cm',
  XCD: 'ag',
  XOF: 'sn',
  XPF: 'pf',
  YER: 'ye',
  ZAR: 'za',
  ZMW: 'zm',
  ZWL: 'zw'
};

const getFlagUrl = (currencyCode) => {
  const countryCode = currencyCountryMap[currencyCode];
  return countryCode ? `https://flagcdn.com/${countryCode}.svg` : '';
};

export default function Mainpage() {
  const [currencies, setCurrencies] = useState([]);
  const [inputCurrency, setInputCurrency] = useState('USD');
  const [outputCurrency, setOutputCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');

  useEffect(() => {
    // Fetch the list of currencies from the API
    fetch('https://v6.exchangerate-api.com/v6/ac61a918e27a3935b8d79858/codes')
      .then(response => response.json())
      .then(data => {
        setCurrencies(data.supported_codes);
      })
      .catch(error => console.error('Error fetching currency codes:', error));
  }, []);

  useEffect(() => {
    if (amount && inputCurrency && outputCurrency) {
      handleConversion();
    }
  }, [amount, inputCurrency, outputCurrency]);

  const handleSwap = () => {
    const tempCurrency = inputCurrency;
    setInputCurrency(outputCurrency);
    setOutputCurrency(tempCurrency);
  };

  const handleConversion = () => {
    fetch(`https://v6.exchangerate-api.com/v6/ac61a918e27a3935b8d79858/pair/${inputCurrency}/${outputCurrency}`)
      .then(response => response.json())
      .then(data => {
        const rate = data.conversion_rate;
        setConvertedAmount((amount * rate).toFixed(2));
      })
      .catch(error => console.error('Error fetching conversion rate:', error));
  };

  return (
    <div className="flex h-screen w-screen font-mono">
      {/* Left Section */}
      <div className="w-1/2 h-full bg-blue-500 flex flex-col items-center justify-center p-4">
        <div className="text-white text-2xl mb-4">Project 06 | Currency Converter</div>
        <div className="mb-4 bg-white rounded p-4 w-3/6 shadow-lg">
          <div className="flex items-center">
            <label className="block text-gray-700 text-xl font-bold mb-2 mr-12 whitespace-nowrap">
              Input Currency | 
            </label>
            <img src={getFlagUrl(inputCurrency)} alt="Flag" className="w-12 
             border-black rounded-md border-1
             h-15 mr-5" />
            <select
              value={inputCurrency}
              onChange={(e) => setInputCurrency(e.target.value)}
              className="w-full p-2 rounded border"
            >
              {currencies.map(([code, name]) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-10">
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 rounded border"
            />
          </div>
          <div className="w-full h-1 bg-blue-500"></div>
          <div className="mb-4 mt-10 flex items-center">
          <label className="block text-gray-700 text-xl font-bold mb-2 mr-8 whitespace-nowrap">
              Output Currency :
            </label>
            <img src={getFlagUrl(outputCurrency)} alt="Flag" className="w-12 
            border-black rounded-md border-1
            h-15 mr-5" />
            <select
              value={outputCurrency}
              onChange={(e) => setOutputCurrency(e.target.value)}
              className="w-full p-2 rounded border"
            >
              {currencies.map(([code, name]) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Converted Amount
            </label>
            <input
              type="text"
              value={convertedAmount}
              readOnly
              className="w-full p-2 rounded border"
            />
          </div>
          <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="bg-gray-600 text-white py-2 px-4 rounded mb-2 mt-4 
            text-xl flex items-center justify-center"
          >
            <i className="fas fa-exchange-alt rotate-90 mr-2"></i>
            Swap
          </button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 h-full bg-blue-100 flex items-center justify-center p-0 relative">
        <img
          src="https://images.unsplash.com/photo-1602272367965-c762564d2932?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGN1cnJlbmN5JTIwZXhjaGFuZ2V8ZW58MHx8MHx8fDA%3D"
          alt="Sample Unsplash"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
