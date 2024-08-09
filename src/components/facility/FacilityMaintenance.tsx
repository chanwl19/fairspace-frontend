import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import { AuthContext } from '../../context/AuthContext';
//import axios from '../../http/axios';
import { AxiosError } from 'axios';
import { Facility } from '../../models/Facility';
import FacilityCard from './components/FacilityCard';
import useAxios from '../../hooks/useAxios';
import Loader from '../../common/loader';
import ErrorAlert from '../uiElements/ErrorAlert';

export default function Reservation() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facility, setFacility] = useState<Facility[]>([]);
  const [displayRecords, setDisplayRecords] = useState<Facility[]>([]);
  const [isActiveRecords, setIsActiveRecords] = useState<boolean>(true);
  const [isInactiveRecords, setIsInactiveRecords] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const axiosWithHeader = useAxios();

  //const authCtx = useContext(AuthContext);

  async function getFacilities() {
    setIsLoading(true);
    try {
      const response = await axiosWithHeader.get('facility');
      setFacility(response.data.facilities);
      setDisplayRecords(response.data.facilities.filter((facility: Facility) => facility.status === 'A'));
      setIsLoading(false);
    } catch (err) {
      setFacility([]);
      setIsLoading(false);
    }
  }

  function displayActiveRecords() {
    setIsActiveRecords(true);
    setIsInactiveRecords(false);
    setDisplayRecords(facility.filter(facility => facility.status === 'A'));
  }

  function displayInactiveRecords() {
    setIsActiveRecords(false);
    setIsInactiveRecords(true);
    setDisplayRecords(facility.filter(facility => facility.status !== 'A'));
  }

  function inactiveFacility() {
    setIsRefresh(!isRefresh);
  }

  useEffect(() => {
    try {
      getFacilities();
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as { message: string };
      console.log("error ", message)
    }
  }, [isRefresh]);

  return (
    <>
      {isLoading && <Loader />}
      {errorMsg &&
        <ErrorAlert
          title="Error"
        >
          <p>{errorMsg}</p>
        </ErrorAlert>
      }
      <div className="flex items-center justify-between mb-3">
        <span className="text-title-md2 font-semibold text-black dark:text-white">
          Facility Maintenance
        </span>
        <NavLink
          to={{ pathname: '/editFacility' }}
          state={{ isNew: true }}
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
            Add Facility
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
              onClick={displayInactiveRecords}
              className={`rounded py-1 px-3 text-xl font-large text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark${isInactiveRecords ? 'bg-white shadow-card dark:bg-boxdark' : ''}`}>
              Inactive
            </button>
          </div>
        </div>
      </div>
      {displayRecords && displayRecords.length > 0 ? (
        displayRecords.map((facility: Facility, index) => {
          return (
            <ul key={index}>
              <FacilityCard facility={facility} inactiveFacilityHandler={inactiveFacility} errorMsgHandler={setErrorMsg} loadingHanlder={setIsLoading} />
            </ul>
          );
        })
      ) : (
        <p>No Facility was found</p>
      )}
    </>
  );
}
