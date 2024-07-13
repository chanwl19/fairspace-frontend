import {lazy} from 'react'

const Calendar = lazy(() => import('../Reservation/Calendar'));

export default function Reservation() {
  return (
    <Calendar />
  )
}
