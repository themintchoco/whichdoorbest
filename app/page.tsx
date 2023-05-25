import Image from 'next/image'
import { Metadata } from 'next'

import icon from '@/public/img/icon.png'
import stationsData from '@/data/stations.json'

import StationsSelector from '@/components/StationsSelector'
import { Line, type Station } from '@/@types/station'

export const metadata: Metadata = {
  themeColor: '#d6dbdc',
}

export default function Home() {
  const stations = new Map<string, Station>()

  for (const stationData of stationsData) {
    const [code, ...nameParts] = stationData.station.split(' ')
    const name = nameParts.join(' ')

    const station = stations.get(name) ?? {
      id: stationData.id,
      codes: [],
      name,
    }

    station.codes.push({
      line: Line[code.slice(0, 2) as keyof typeof Line],
      code,
    })

    if (!stations.has(name))
      stations.set(name, station)
  }

  return (
    <div className="flex min-h-[100svh] max-w-3xl flex-col items-center justify-center p-4 mx-auto">
      <Image src={icon} alt="icon" className="w-32 drop-shadow-lg" />
      <h1 className="text-4xl font-bold text-center my-4">whichdoor.best</h1>
      <StationsSelector stations={Array.from(stations.values())} />
    </div>
  )
}
