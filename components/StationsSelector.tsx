'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import StationInput from './StationInput'
import normalizeStationName from '@/utils/normalizeStationName'
import type { Station } from '@/@types/station'

export interface StationsSelectorProps {
  stations: Station[]
}

const StationsSelector = ({
  stations,
} : StationsSelectorProps) => {
  const { push } = useRouter()

  const [source, setSource] = useState<Station | null>(null)
  const [destination, setDestination] = useState<Station | null>(null)

  const [error, setError] = useState('')

  const destinationInput = useRef<HTMLInputElement>(null)
  const submitInput = useRef<HTMLInputElement>(null)

  const handleSourceChange = useCallback((newSource: Station | null) => {
    setSource(newSource)
  }, [])

  const handleDestinationChange = useCallback((newDestination: Station | null) => {
    setDestination(newDestination)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!source || !destination) {
      setError('Unable to route. Please check that the station names provided are valid.')
      return
    }

    push(`/route/${normalizeStationName(source.name)}/${normalizeStationName(destination.name)}`)
  }

  return (
    <form className="flex flex-col justify-center w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center bg-white drop-shadow-[0_5px_rgba(0,0,0,0.25)] p-4 my-8 rounded-3xl">
        <StationInput stations={stations} onStationChange={handleSourceChange} onSuggestionAccepted={() => destinationInput.current?.focus()} placeholder="Starting station" />
        <StationInput stations={stations} onStationChange={handleDestinationChange} onSuggestionAccepted={() => submitInput.current?.focus()} placeholder="Destination" ref={destinationInput} />
      </div>

      <input type="submit" className="flex items-center justify-center text-white bg-indigo-500 drop-shadow-[0_5px_rgba(30,27,75,0.75)] p-4 rounded-3xl cursor-pointer" value="Route" ref={submitInput} />

      <p className="text-center text-rose-600 mt-8">{ error }</p>
    </form>
  )
}

export default StationsSelector
