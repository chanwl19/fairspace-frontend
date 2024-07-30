import { NavLink } from 'react-router-dom';
import { Reservation as ReservationDetail } from '../../models/Reservation';
import ReservationCard from '../UiElements/ReservationCard';

const reservations: ReservationDetail[] = [];
const reservation1 = new ReservationDetail();
reservation1._id = Object('1');
reservation1.startDate = new Date('2024-07-31T15:30:00');
reservation1.endDate = new Date('2024-07-31T16:30:00');
reservation1.facilityName = 'A1-12';
const reservation2 = new ReservationDetail();
reservation2._id = Object('2');
reservation2.startDate = new Date('2024-07-31T17:30:00');
reservation2.endDate = new Date('2024-07-31T19:30:00');
reservation2.facilityName = 'A1-32';
const reservation3 = new ReservationDetail();
reservation3._id = Object('2');
reservation3.startDate = new Date('2024-07-30T17:30:00');
reservation3.endDate = new Date('2024-07-30T19:30:00');
reservation3.facilityName = 'A1-22';
reservations.push(reservation1);
reservations.push(reservation2);
reservations.push(reservation3);

export default function Reservation() {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-title-md2 font-semibold text-black dark:text-white">
          Reservation
        </span>
        <NavLink
          to={{ pathname: '/editReservation' }}
          state={{ isAddUser: true, user: undefined }}
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
            Add
          </span>
        </NavLink>
      </div>
      {reservations && reservations.length > 0 ? (
        reservations.map((reservation: ReservationDetail, index) => {
          return (
            <ul key={index}>
              <ReservationCard reservation={reservation} />
            </ul>
          );
        })
      ) : (
        <p>No Reservation was found</p>
      )}
    </>
  );
}
