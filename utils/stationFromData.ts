import type stationsData from '@/data/stations.json'

import { Line, type Station } from '@/@types/station'

const stationFromData = (data: typeof stationsData[number]): Station => {
  const [code, ...nameParts] = data.station.split(' ')
  const name = nameParts.join(' ')

  const line = Line[code.slice(0, 2) as keyof typeof Line]

  return {
    id: data.id,
    codes: [{ line, code}],
    name,
  }
}

export default stationFromData
