import { NavLink } from 'react-router-dom';
import { Reservation as ReservationDetail } from '../../models/Reservation';
import ReservationCard from '../UiElements/ReservationCard';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../http/axios';
import { AxiosError } from 'axios';

export default function Reservation() {

  const [reservations, setReservations] = useState<ReservationDetail[]>([]);
  const [displayRecords, setDisplayRecords] = useState<ReservationDetail[]>([]);
  const [isActiveRecords, setIsActiveRecords] = useState<boolean>(true);
  const [isCancelRecords, setIsCancelRecords] = useState<boolean>(false);
  const [isRefresh, setIsRefresh ] = useState<boolean>(false);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  async function getReservations() {
    const response = await axios.get('reservation', {
      params: {
        userId: user?.userId
      }
    });
    setReservations(response.data.reservations);
    setDisplayRecords(response.data.reservations.filter((reservation: ReservationDetail) => reservation.status === 'A'));
  }

  function displayActiveRecords(){
    setIsActiveRecords(true);
    setIsCancelRecords(false);
    setDisplayRecords(reservations.filter(reservation => reservation.status === 'A'));
  }

  function displayCancelRecords(){
    setIsActiveRecords(false);
    setIsCancelRecords(true);
    setDisplayRecords(reservations.filter(reservation => reservation.status === 'C'));
  }

  async function cancelReservation(){
    setIsRefresh(true);
  }

  useEffect(() => {
    try {
      console.log("Start use ffect")
      getReservations();
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as { message: string };
      console.log("error ", message)
    }
  }, [isRefresh]);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-title-md2 font-semibold text-black dark:text-white">
          Reservation
        </span>
        <NavLink
          to={{ pathname: '/editReservation' }}
          state={{ isNew: true, isEdit: false, isView: false}}
        >
          <span className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Reserve
          </span>
        </NavLink>
      </div>
      <div>
        <div className="flex w-full justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              onClick={displayActiveRecords}
              className={`rounded py-1 px-3 text-xl font-large text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark${isActiveRecords ? 'bg-white shadow-card dark:bg-boxdark' : ''}`}>
              Active
            </button>
            <button
              onClick={displayCancelRecords}
              className={`rounded py-1 px-3 text-xl font-large text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark${isCancelRecords ? 'bg-white shadow-card dark:bg-boxdark' : ''}`}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      {displayRecords && displayRecords.length > 0 ? (
        displayRecords.map((reservation: ReservationDetail, index) => {
          return (
            <ul key={index}>
              <ReservationCard reservation={reservation} cancelReservationHandler={cancelReservation} />
            </ul>
          );
        })
      ) : (
        <p>No Reservation was found</p>
      )}
    </>
  );
}
