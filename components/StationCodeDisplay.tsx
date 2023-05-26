import { LTAIdentity } from '@/fonts'

import { Line, StationCode } from '@/@types/station'

const lineColors = {
  [Line.EW]: 'bg-ew',
  [Line.CG]: 'bg-ew',
  [Line.NS]: 'bg-ns',
  [Line.NE]: 'bg-ne',
  [Line.CC]: 'bg-cc',
  [Line.CE]: 'bg-cc',
  [Line.DT]: 'bg-dt',
  [Line.TE]: 'bg-te',
}

interface StationCodeDisplayProps {
  codes: StationCode[],
}

const StationCodeDisplay = ({
  codes,
} : StationCodeDisplayProps) => {
  return (
    <div className="inline-flex">
      {
        codes.map((code) => (
          <div className={`px-2 text-sm text-white ${lineColors[code.line]}`} key={code.code}>
            <span className={LTAIdentity.className}>{ code.code.slice(0, 2) } { code.code.slice(2) }</span>
          </div>
        ))
      }
    </div>
  )
}

export default StationCodeDisplay
