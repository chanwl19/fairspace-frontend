import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import { Reservation } from '../../models/Reservation';

type ReservationCardProps = {
  reservation: Reservation;
};

export default function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {reservation.facilityName}
          </h4>
          <p>{reservation.startDate.toDateString()} -{reservation.endDate.toDateString()}</p>
        </div>
        <div className="flex justify-end gap-4.5">
          <BsFillTrashFill className="delete-btn cursor-pointer" />
          <BsFillPencilFill className="edit-btn cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
