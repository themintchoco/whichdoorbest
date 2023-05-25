import { Fragment } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PriorityQueue from 'priorityqueue'

import platformsData from '@/data/platforms.json'
import stationsData from '@/data/stations.json'
import terminationsData from '@/data/terminations.json'

import RouteCard from '@/components/RouteCard'
import normalizeStationName from '@/utils/normalizeStationName'
import stationFromData from '@/utils/stationFromData'

type PlatformData = typeof platformsData[number]
type StationData = typeof stationsData[number]

export const metadata: Metadata = {
  themeColor: '#6366f1',
}

interface QueueItem {
  platformId: number,
  distance: number,
}

const route = (source: StationData[], destination: StationData[]) => {
  const queue = new PriorityQueue({
    comparator: (a: QueueItem, b: QueueItem) => b.distance - a.distance,
  })

  const dist: number[] = []
  const prev: [number, number][] = []

  const destinationPlatforms = new Set<number>()

  for (const sourceStation of source) {
    for (const sourcePlatformId of sourceStation.platforms) {
      dist[sourcePlatformId] = 0

      queue.push({
        platformId: sourcePlatformId,
        distance: 0,
      })
    }
  }

  for (const destinationStation of destination) {
    for (const destinationPlatformId of destinationStation.platforms) {
      destinationPlatforms.add(destinationPlatformId)
    }
  }

  while (!queue.isEmpty()) {
    const { platformId, distance } = queue.pop()

    if (dist[platformId] < distance) continue

    if (destinationPlatforms.has(platformId)) {
      let result = [[-1, platformId]]

      let transfer = prev[platformId]
      while (transfer !== undefined) {
        result[0][0] = transfer[1]

        if (transfer[0] === -1) break
        result.unshift([-1, transfer[0]])

        transfer = prev[transfer[0]]
      }

      return result
    }

    for (const [nextPlatformId, weight, isTransfer] of platformsData[platformId].connections) {
      const oldDist = dist[nextPlatformId]

      if (oldDist === undefined || oldDist > distance + weight) {
        dist[nextPlatformId] = distance + weight
        prev[nextPlatformId] = isTransfer ? [platformId, nextPlatformId] : prev[platformId] ?? [-1, platformId]

        queue.push({
          platformId: nextPlatformId,
          distance: distance + weight,
        })
      }
    }
  }

  return []
}

export default function Route({
  params,
} : {
  params: {
    source: string,
    destination: string,
  }
}) {
  let sourceStations: StationData[] = []
  let destinationStations: StationData[] = []

  for (const stationData of stationsData) {
    const [, ...nameParts] = stationData.station.split(' ')
    const name = nameParts.join(' ')

    if (normalizeStationName(name) === params.source) sourceStations.push(stationData)
    if (normalizeStationName(name) === params.destination) destinationStations.push(stationData)
  }

  if (sourceStations.length === 0 || destinationStations.length === 0) notFound()

  const routePath = route(sourceStations, destinationStations)

  return (
    <div className="min-h-[100svh]">
      <div className="sticky top-0 w-[100dvw] text-indigo-50 bg-indigo-500 drop-shadow-[0_5px_rgba(30,27,75,0.75)]">
        <div className="flex items-center justify-between font-medium max-w-3xl px-4 py-2 mx-auto">
          <div className="basis-0 grow text-center bg-white/20 px-4 py-2 rounded-xl">
            { stationFromData(sourceStations[0]).name }
          </div>
          <span className="px-2">-&gt;</span>
          <div className="basis-0 grow text-center bg-white/20 px-4 py-2 rounded-xl">
            { stationFromData(destinationStations[0]).name }
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {
          routePath.map(([platformId, transferPlatformId], idx) => {
            const platformData = platformsData[platformId]
            const stationData = stationsData[platformData.station]
            const station = stationFromData(stationData)

            const transferPlatformData = platformsData[transferPlatformId]
            const transferStationData = stationsData[transferPlatformData.station]
            const transferStation = stationFromData(transferStationData)

            let doors: number[] | null = null

            if (idx === routePath.length - 1) {
              doors = transferPlatformData.doors.escalators.Exit ?? null
            } else {
              doors = transferPlatformData.doors.escalators.transfers?.[routePath[idx+1][0].toString() as keyof PlatformData['doors']['escalators']['transfers']] ?? transferPlatformData.doors.escalators.Exit ?? null
            }

            let message = idx === 0 ? 'Board ' : 'Transfer to '
            message += 'the train bound for '
            message += platformData.towards.map((towards) => terminationsData[towards]).join(' / ')

            if (doors) {
              if (doors.length === 1) message += ' at door ' + doors[0]
              else if (doors.length > 1) message += ' at doors ' + doors.slice(0, -1).join(', ') + ' or ' + doors.at(-1)
            }

            message += '. Alight at '
            message += transferStation.name

            if (doors && doors.length === 0) message += ' and cross the platform for transfer'

            message += '. '

            return idx < routePath.length - 1 ? (
              <RouteCard station={station} key={platformId}>{ message }</RouteCard> 
            ) : (
              <Fragment key={platformId}>
                <RouteCard station={station}>{ message }</RouteCard>
                <RouteCard station={transferStation}>
                  Arrive at { transferStation.name }. 
                  
                  {
                    Object.entries(transferPlatformData.doors.escalators.others ?? {}).map(([key, value]) => (
                      <div className="flex justify-between text-md text-slate-600 bg-slate-200 rounded-lg px-3 py-2 mt-3 -mx-2" key={key}>
                        <span>{ key }</span>
                        <span>{ value }</span>
                      </div>
                    ))
                  }
                </RouteCard>
              </Fragment>
            )
          })
        }
      </div>
    </div>
  )
}