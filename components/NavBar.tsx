'use client'

import { useRouter } from 'next/navigation'

import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { ArrowUpOnSquareIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

import type { Station } from '@/@types/station'

export interface NavBarProps {
  sourceStation: Station,
  destinationStation: Station,
}

const NavBar = ({
  sourceStation,
  destinationStation,
} : NavBarProps) => {
  const router = useRouter()

  const shareData = {
    url: location.href,
    title: `${sourceStation.name} to ${destinationStation.name} | WhichDoorBest`,
  }

  return (
    <div className="flex flex-col sticky top-0 w-[100dvw] text-indigo-50 bg-indigo-500 border-b-4 border-indigo-900 z-[100]">
      {
        (navigator.standalone || matchMedia('(display-mode: standalone)').matches) && (
          <div className="flex items-center justify-between py-2">
            <div className="flex ml-3" onClick={() => router.back()}>
              <ChevronLeftIcon className="h-6 w-6" />
              Back
            </div>

            {
              navigator.canShare && navigator.canShare(shareData) && (
                <ArrowUpOnSquareIcon className="h-6 w-6 mr-4" onClick={() => navigator.share(shareData)} />
              )
            }
          </div>
        )
      }

      <div className="flex items-center justify-between font-medium max-w-3xl w-full px-4 py-2 mx-auto">
        <div className="basis-0 grow text-center bg-white/20 px-2 py-2 rounded-xl">
          { sourceStation.name }
        </div>

        <ArrowRightIcon className="h-5 w-5 mx-2" />

        <div className="basis-0 grow text-center bg-white/20 px-2 py-2 rounded-xl">
          { destinationStation.name }
        </div>
      </div>
    </div>
  )
}

export default NavBar
