'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ── */
interface WeatherData {
  city: string; country: string; temp: number; feelsLike: number
  humidity: number; windSpeed: number; description: string; emoji: string
  pressure: number; visibility: number; clouds: number; code: number
}
interface SoilData {
  ph: number; moisture: number; nitrogen: number
  phosphorus: number; potassium: number; organicMatter: number; status: string
}
interface CropPrice { name: string; price: number; unit: string; change: number; icon: string }
type Tab = 'gps' | 'city' | 'coords'
type Status = 'idle' | 'loading' | 'done' | 'error'

/* ─── WMO weather code → label + emoji ── */
function wmoToInfo(code: number): { label: string; emoji: string } {
  if (code === 0)              return { label: 'Clear sky', emoji: '☀️' }
  if (code === 1)              return { label: 'Mainly clear', emoji: '🌤️' }
  if (code === 2)              return { label: 'Partly cloudy', emoji: '⛅' }
  if (code === 3)              return { label: 'Overcast', emoji: '☁️' }
  if ([45,48].includes(code)) return { label: 'Foggy', emoji: '🌫️' }
  if ([51,53,55].includes(code)) return { label: 'Drizzle', emoji: '🌦️' }
  if ([61,63,65].includes(code)) return { label: 'Rain', emoji: '🌧️' }
  if ([71,73,75].includes(code)) return { label: 'Snow', emoji: '❄️' }
  if ([80,81,82].includes(code)) return { label: 'Rain showers', emoji: '🌧️' }
  if ([95,96,99].includes(code)) return { label: 'Thunderstorm', emoji: '⛈️' }
  return { label: 'Unknown', emoji: '🌡️' }
}

/* ─── Helpers ── */
function getMockSoil(lat: number, lon: number): SoilData {
  const seed = Math.abs((lat * 13.7 + lon * 7.3)) % 1
  return {
    ph: +(5.8 + seed * 2.4).toFixed(1),
    moisture: +(35 + seed * 40).toFixed(1),
    nitrogen: +(120 + seed * 80).toFixed(0),
    phosphorus: +(25 + seed * 35).toFixed(0),
    potassium: +(180 + seed * 120).toFixed(0),
    organicMatter: +(1.8 + seed * 3.2).toFixed(1),
    status: seed < 0.4 ? 'Optimal' : seed < 0.7 ? 'Good' : 'Needs Attention',
  }
}

const PRICES: CropPrice[] = [
  { name: 'Wheat',     price: 2180, unit: '₹/qtl', change: +1.2, icon: '🌾' },
  { name: 'Rice',      price: 3450, unit: '₹/qtl', change: -0.8, icon: '🍚' },
  { name: 'Maize',     price: 1920, unit: '₹/qtl', change: +2.5, icon: '🌽' },
  { name: 'Soybean',   price: 4680, unit: '₹/qtl', change: +0.4, icon: '🫘' },
  { name: 'Cotton',    price: 6750, unit: '₹/qtl', change: -1.3, icon: '☁️' },
  { name: 'Sugarcane', price: 315,  unit: '₹/qtl', change: +0.1, icon: '🍬' },
]

/* ─── API calls (no key needed) ── */
async function fetchOpenMeteo(lat: number, lon: number): Promise<{ temp: number; feelsLike: number; humidity: number; windSpeed: number; pressure: number; visibility: number; clouds: number; code: number }> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,cloud_cover,visibility,weather_code&wind_speed_unit=ms&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`)
  const d = await res.json()
  const c = d.current
  return {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: +(c.wind_speed_10m).toFixed(1),
    pressure: Math.round(c.surface_pressure),
    visibility: Math.round((c.visibility ?? 10000) / 1000),
    clouds: c.cloud_cover,
    code: c.weather_code,
  }
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string; country: string }> {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
  if (!res.ok) throw new Error('Geocoding failed')
  const d = await res.json()
  if (!d.results?.length) throw new Error(`City "${city}" not found. Check the spelling.`)
  const r = d.results[0]
  return { lat: r.latitude, lon: r.longitude, name: r.name, country: r.country_code?.toUpperCase() ?? '' }
}

async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string }> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, { headers: { 'Accept-Language': 'en' } })
    const d = await res.json()
    return { name: d.address?.city || d.address?.town || d.address?.village || d.address?.county || 'Your Location', country: d.address?.country_code?.toUpperCase() ?? '' }
  } catch { return { name: 'Your Location', country: '' } }
}

/* ─── Small UI pieces ── */
function Label({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-green-600/10 text-green-600 dark:text-green-400 flex items-center justify-center">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">{text}</p>
    </div>
  )
}

function Row({ label, val, sub }: { label: string; val: string | number; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/60 last:border-0">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {val}{sub && <span className="text-xs font-normal text-slate-400 ml-1">{sub}</span>}
      </span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
      <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
      {[1,2,3,4].map(i => <div key={i} className="h-3 w-full bg-slate-100 dark:bg-slate-700/60 rounded mb-2" />)}
    </div>
  )
}

function WeatherCard({ d }: { d: WeatherData }) {
  const threats: string[] = []
  if (d.temp > 35) threats.push('Heat stress')
  if (d.temp < 5) threats.push('Frost risk')
  if (d.windSpeed > 10) threats.push('High winds')
  if (d.code >= 61 && d.code <= 99) threats.push('Heavy precipitation')
  if (d.humidity > 85 && d.temp > 25) threats.push('Fungal risk')

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 shadow-sm flex flex-col h-full">
      <Label icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>} text="Live Weather" />
      <div className="flex items-center gap-3 mb-3">
        <span className="text-5xl">{d.emoji}</span>
        <div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">{d.temp}°C</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{d.description}</p>
        </div>
      </div>
      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-3">📍 {d.city}{d.country ? `, ${d.country}` : ''}</p>
      
      <div className="flex-1">
        <Row label="Feels like"  val={`${d.feelsLike}°C`} />
        <Row label="Humidity"    val={`${d.humidity}%`} />
        <Row label="Wind"        val={d.windSpeed} sub="m/s" />
        <Row label="Pressure"    val={d.pressure} sub="hPa" />
        <Row label="Visibility"  val={d.visibility} sub="km" />
        <Row label="Cloud Cover" val={`${d.clouds}%`} />
      </div>

      {threats.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
          <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-1.5">
            ⚠️ Potential Threats
          </p>
          <ul className="list-disc pl-4 text-[11px] text-red-600 dark:text-red-300 space-y-0.5 font-medium">
            {threats.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

function SoilCard({ d }: { d: SoilData }) {
  const chip = d.status === 'Optimal' ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
    : d.status === 'Good' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
    : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400'
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.08 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 shadow-sm">
      <Label icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22V12M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z"/></svg>} text="Soil Conditions" />
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${chip}`}>{d.status}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">estimated for region</span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1"><span className="text-xs text-slate-500 dark:text-slate-400">pH Level</span><span className="text-sm font-bold text-slate-800 dark:text-white">{d.ph}</span></div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-red-400 via-green-400 to-blue-400" style={{ width:`${((d.ph-3)/11)*100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>Acidic</span><span>Neutral</span><span>Alkaline</span></div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1"><span className="text-xs text-slate-500 dark:text-slate-400">Moisture</span><span className="text-sm font-bold text-slate-800 dark:text-white">{d.moisture}%</span></div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-blue-400" style={{ width:`${d.moisture}%` }} />
        </div>
      </div>
      <Row label="Nitrogen (N)"   val={d.nitrogen}    sub="kg/ha" />
      <Row label="Phosphorus (P)" val={d.phosphorus}  sub="kg/ha" />
      <Row label="Potassium (K)"  val={d.potassium}   sub="kg/ha" />
      <Row label="Organic Matter" val={`${d.organicMatter}%`} />
    </motion.div>
  )
}

function MarketCard() {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.16 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 shadow-sm">
      <Label icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} text="Crop Market Prices" />
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">MSP indicative rates · Updated today</p>
      <div className="space-y-1.5">
        {PRICES.map(c => (
          <div key={c.name} className="flex items-center justify-between rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-700/40 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <div className="flex items-center gap-2"><span className="text-base">{c.icon}</span><span className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.name}</span></div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.price.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-400">{c.unit}</span></p>
              <p className={`text-[11px] font-semibold ${c.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{c.change >= 0 ? '▲' : '▼'} {Math.abs(c.change)}%</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main ── */
export default function LocalDetails() {
  const [tab, setTab]       = useState<Tab>('gps')
  const [status, setStatus] = useState<Status>('idle')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [soil, setSoil]     = useState<SoilData | null>(null)
  const [error, setError]   = useState('')
  const [city, setCity]     = useState('')
  const [lat, setLat]       = useState('')
  const [lon, setLon]       = useState('')

  async function load(la: number, lo: number, name: string, country: string) {
    setStatus('loading'); setError(''); setWeather(null); setSoil(null)
    try {
      const w = await fetchOpenMeteo(la, lo)
      const { label, emoji } = wmoToInfo(w.code)
      setWeather({ city: name, country, temp: w.temp, feelsLike: w.feelsLike, humidity: w.humidity, windSpeed: w.windSpeed, description: label, emoji, pressure: w.pressure, visibility: w.visibility, clouds: w.clouds, code: w.code })
      setSoil(getMockSoil(la, lo))
      setStatus('done')
    } catch (e: any) { setError(e.message || 'Failed to fetch weather.'); setStatus('error') }
  }

  function handleGPS() {
    if (!navigator.geolocation) { setError('Geolocation not supported.'); setStatus('error'); return }
    setStatus('loading'); setError('')
    navigator.geolocation.getCurrentPosition(
      async pos => { const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude); load(pos.coords.latitude, pos.coords.longitude, geo.name, geo.country) },
      err => { setError(err.code === 1 ? 'Location access denied.' : 'Could not detect location.'); setStatus('error') },
      { timeout: 10000 }
    )
  }

  async function handleCitySearch(e: React.FormEvent) {
    e.preventDefault(); if (!city.trim()) return
    setStatus('loading'); setError('')
    try { const geo = await geocodeCity(city.trim()); load(geo.lat, geo.lon, geo.name, geo.country) }
    catch (e: any) { setError(e.message); setStatus('error') }
  }

  function handleCoordsSearch(e: React.FormEvent) {
    e.preventDefault()
    const la = parseFloat(lat), lo = parseFloat(lon)
    if (isNaN(la) || isNaN(lo) || la < -90 || la > 90 || lo < -180 || lo > 180) { setError('Enter valid latitude (−90 to 90) and longitude (−180 to 180).'); setStatus('error'); return }
    reverseGeocode(la, lo).then(geo => load(la, lo, geo.name, geo.country))
  }

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'gps',    label: 'My Location', emoji: '📍' },
    { id: 'city',   label: 'Search City', emoji: '🔍' },
    { id: 'coords', label: 'Coordinates', emoji: '🗺️' },
  ]

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit mx-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setStatus('idle'); setError('') }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            <span>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <AnimatePresence mode="wait">
        {tab === 'gps' && (
          <motion.div key="gps" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }} className="flex justify-center">
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={handleGPS} disabled={status === 'loading'}
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-lg shadow-green-200 dark:shadow-green-900/30 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {status === 'loading' && tab === 'gps' ? 'Detecting…' : 'Use My GPS Location'}
            </motion.button>
          </motion.div>
        )}
        {tab === 'city' && (
          <motion.form key="city" onSubmit={handleCitySearch} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }} className="flex gap-2 max-w-md mx-auto">
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai, Tokyo, New York…"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
            <button type="submit" disabled={status === 'loading'} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
              {status === 'loading' && tab === 'city' ? '…' : 'Search'}
            </button>
          </motion.form>
        )}
        {tab === 'coords' && (
          <motion.form key="coords" onSubmit={handleCoordsSearch} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }} className="flex gap-2 max-w-lg mx-auto flex-wrap justify-center">
            <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude (e.g. 28.61)"
              className="w-44 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
            <input type="number" step="any" value={lon} onChange={e => setLon(e.target.value)} placeholder="Longitude (e.g. 77.20)"
              className="w-44 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
            <button type="submit" disabled={status === 'loading'} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
              {status === 'loading' && tab === 'coords' ? '…' : 'Fetch Weather'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="flex items-center justify-between gap-3 max-w-lg mx-auto px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">⚠️ {error}</p>
            <button onClick={() => { setStatus('idle'); setError('') }} className="text-xs text-red-500 hover:text-red-700 font-medium underline underline-offset-2">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      {status === 'loading' && <div className="grid grid-cols-1 sm:grid-cols-3 gap-5"><Skeleton /><Skeleton /><Skeleton /></div>}
      {status === 'done' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {weather ? <WeatherCard d={weather} /> : <Skeleton />}
          {soil    ? <SoilCard    d={soil}    /> : <Skeleton />}
          <MarketCard />
        </div>
      )}
    </div>
  )
}
