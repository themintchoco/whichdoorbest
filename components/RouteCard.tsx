import StationCodeDisplay from './StationCodeDisplay'
import type { Station } from '@/@types/station'

export interface RouteCardProps {
  station: Station
  children: React.ReactNode
}

const RouteCard = ({
  station,
  children,
} : RouteCardProps) => {

  return (
    <div className="bg-white drop-shadow-[0_5px_rgba(0,0,0,0.25)] px-6 py-4 mx-4 my-8 rounded-3xl">
      <StationCodeDisplay codes={station.codes} />
      <span className="ml-2 font-medium">{ station.name }</span>
      <div className="mt-2">{ children }</div>
    </div>
  )
}

export default RouteCard
