import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { supabase } from '../lib/supabase'
import { countryNameToISO3 } from '../utils/countryMapping'

/* ── TopoJSON source ──────────────────────────────────── */
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

/* ── Fetch & aggregate registrations by country ────────── */
async function fetchCountryData() {
  const { data, error } = await supabase
    .from('registrations')
    .select('country')

  if (error) {
    console.error('WorldHeatMap fetch error:', error.message)
    return {}
  }

  const counts = {}
  for (const row of data ?? []) {
    const iso = countryNameToISO3(row.country)
    if (!iso) continue
    counts[iso] = (counts[iso] || 0) + 1
  }
  return counts
}

/* ── Tooltip component ─────────────────────────────────── */
function Tooltip({ content, position }) {
  if (!content) return null
  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg bg-primary-800 text-white text-xs font-medium px-3 py-1.5 shadow-lg whitespace-nowrap"
      style={{ left: position.x + 12, top: position.y - 28 }}
    >
      {content}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   WorldHeatMap
   ══════════════════════════════════════════════════════════ */
export default function WorldHeatMap() {
  const [countryCounts, setCountryCounts] = useState({})
  const [tooltip, setTooltip] = useState({ content: '', position: { x: 0, y: 0 } })

  /* ── Data fetching + real-time ────────────────────────── */
  const refresh = useCallback(async () => {
    const data = await fetchCountryData()
    setCountryCounts(data)
  }, [])

  useEffect(() => {
    refresh()

    // Poll every 30 s
    const interval = setInterval(refresh, 30_000)

    // Real-time subscription
    const channel = supabase
      .channel('registrations-map')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => refresh(),
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [refresh])

  /* ── Colour scale ─────────────────────────────────────── */
  const maxCount = useMemo(
    () => Math.max(1, ...Object.values(countryCounts)),
    [countryCounts],
  )

  const colorScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxCount])
        .range(['#dbe4ff', '#1a3a6b']),
    [maxCount],
  )

  /* ── Event handlers ───────────────────────────────────── */
  const handleMouseEnter = useCallback(
    (geo, evt) => {
      const name = geo.properties.name
      const iso = geo.properties['Alpha-3'] ?? geo.id
      const count = countryCounts[iso] || 0
      setTooltip({
        content: `${name} — ${count} registration${count !== 1 ? 's' : ''}`,
        position: { x: evt.clientX, y: evt.clientY },
      })
    },
    [countryCounts],
  )

  const handleMouseMove = useCallback((_, evt) => {
    setTooltip((prev) => ({
      ...prev,
      position: { x: evt.clientX, y: evt.clientY },
    }))
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTooltip({ content: '', position: { x: 0, y: 0 } })
  }, [])

  /* ── Render ───────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
        <h2 className="text-xl font-bold text-primary-700 mb-1">Alumni Around the World</h2>
        <p className="text-sm text-primary-400">
          Colour intensity reflects the number of registrations per country.
        </p>
      </div>

      {/* Map */}
      <div className="w-full aspect-[2/1] min-h-[260px]">
        <ComposableMap
          projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
          className="w-full h-full"
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso = geo.properties['Alpha-3'] ?? geo.id
                  const count = countryCounts[iso] || 0

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                      onMouseMove={(evt) => handleMouseMove(geo, evt)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: count > 0 ? colorScale(count) : '#f1f3f5',
                          stroke: '#dee2e6',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: count > 0 ? colorScale(count) : '#e9ecef',
                          stroke: '#4c6ef5',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: { outline: 'none' },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 px-6 pb-6 pt-2 sm:px-8">
        <span className="text-xs text-primary-400">0</span>
        <div
          className="h-2.5 w-32 rounded-full"
          style={{
            background: `linear-gradient(to right, #dbe4ff, #1a3a6b)`,
          }}
        />
        <span className="text-xs text-primary-400">{maxCount}+</span>
      </div>

      {/* Tooltip (portal-free, fixed positioning) */}
      <Tooltip content={tooltip.content} position={tooltip.position} />
    </motion.div>
  )
}
