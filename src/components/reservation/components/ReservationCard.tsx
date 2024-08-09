import { BsFillTrashFill} from 'react-icons/bs';
import { Reservation } from '../../../models/Reservation';
import { convertDateToString } from '../../../utils/dateFormat';
import { AxiosError } from 'axios';
import axios from '../../../http/axios';

type ReservationCardProps = {
  reservation: Reservation;
  cancelReservationHandler: () => void;
  errorMsgHandler: (msg: string) => void;
  loadingHanlder: (loading: boolean) => void;
};

export default function ReservationCard({ reservation, cancelReservationHandler, errorMsgHandler, loadingHanlder }: ReservationCardProps) {

  async function cancelReservation() {
    const facilityId = reservation.facility._id.toString();
    const reservationId = reservation._id.toString();
    const userId = reservation.userId;
    const reserveStartDt = reservation.reserveStartTime;
    const reserveEndDt = reservation.reserveEndTime;
    const status = 'C';
    loadingHanlder(true);
    try {
      await axios.patch('reservation',
        JSON.stringify({
          facilityId: facilityId,
          reservationId: reservationId,
          userId: userId,
          reserveStartDt: reserveStartDt,
          reserveEndDt: reserveEndDt,
          status: status
        }));
      cancelReservationHandler();
      loadingHanlder(false);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as { message: string };
      errorMsgHandler(message);
      loadingHanlder(false);
    }
  }

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {reservation.facility.location}
          </h4>
          <label>Facility Type : </label>
          <span>{reservation.facility.type === 'D' ? 'Desk' : 'Room'}</span>
          <p>{convertDateToString(reservation.reserveStartTime.toString())} - {convertDateToString(reservation.reserveEndTime.toString())}</p>
          <label>Status : </label>
          <span>{reservation.status === 'A' ? 'Active' : 'Cancel'}</span>
        </div>
        <div className="flex justify-end gap-4.5">
          {reservation.status === 'A' &&
            (
              <>
                <BsFillTrashFill className="delete-btn cursor-pointer" onClick={cancelReservation} />
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}
