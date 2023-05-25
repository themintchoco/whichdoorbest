'use client'

import { ForwardedRef, forwardRef, useEffect, useState } from 'react'

import StationCodeDisplay from './StationCodeDisplay'
import normalizeStationName from '@/utils/normalizeStationName'
import type { Station } from '@/@types/station'

export interface StationInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  stations: Station[]
  onStationChange?: (station: Station | null) => void
  onSuggestionAccepted?: (station: Station) => void
}

const StationInput = forwardRef(({
  stations,
  onStationChange,
  onSuggestionAccepted,
  ...props
} : StationInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const [station, setStation] = useState<Station | null>(null)

  useEffect(() => {
    onStationChange?.(station)
  }, [station])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setStation(stations.find((station) => normalizeStationName(station.name) == normalizeStationName(e.target.value)) ?? null)
  }

  const handleSuggestionAccepted = (name: string) => {
    setValue(name)

    const newStation = stations.find((station) => normalizeStationName(station.name) == normalizeStationName(name))!
    onSuggestionAccepted?.(newStation)
    setStation(newStation)
  }

  return (
    <>
      <div className="flex items-center bg-slate-200 rounded-xl m-2">
        <div className="shrink-0 mx-3">
          {
            station && (
              <div className="ml-1">
                <StationCodeDisplay codes={station.codes} />
              </div>
            )
          }
        </div>

        <div className="grow-1">
          <input type="text" className="w-full text-xl text-slate-600 bg-transparent outline-none pr-6 py-4" value={value} onChange={handleChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} ref={ref} {...props} />
        </div>
      </div>
      
      {
        focused && value.length > 0 && (
          <div className="flex flex-nowrap items-center overflow-x-auto px-5 py-4 -mx-4">
            {
              stations
                .flatMap((station) => {
                  const index = normalizeStationName(station.name).indexOf(normalizeStationName(value))
              
                  return index == -1 ? [] : {
                    station,
                    index,
                  }
                })
                .sort((a, b) => a.index - b.index)
                .map(({ station }) => (
                  <div className="shrink-0 text-slate-100 bg-slate-600 rounded-md px-4 py-2 mx-1 cursor-pointer" onClick={() => handleSuggestionAccepted(station.name)} onMouseDown={(e) => e.preventDefault()} key={station.id}>
                    <StationCodeDisplay codes={station.codes} />
                    <span className="ml-2">{ station.name }</span>
                  </div>
                ))
            }
          </div>
        )
      }
    </>
  )
})

export default StationInput
