import React, { useRef, useState } from 'react';
//import { useLocation } from "react-router-dom";
import axios from '../../http/axios';
import Loader from '../../common/loader';
import { AxiosError } from 'axios';
//import { AuthContext } from '../../context/AuthContext';
//import { Reservation } from '../../models/Reservation';
import { AvailableTimeSlot } from '../../models/AvailableTimeSlot';
import TimeSlotTable from './TimeSlotTable';


export default function EditReservation() {

    const [isLoading] = useState<boolean>(false);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [isRoom, setIsRoom] = useState<boolean>(true);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeSlot[]>([]);
    //const location = useLocation();
    //const authCtx = useContext(AuthContext);
    const dateString = (new Date()).getUTCFullYear().toString() + "-" + (((new Date()).getUTCMonth() + 1).toString()).padStart(2, '0') + "-" + ((new Date()).getUTCDate().toString()).padStart(2, '0');

    //const user = authCtx.user;
    //const state = location.state;
    //const isNew: boolean = state.isNew;
    //const isEdit: boolean = state.isEdit;
    //const isView: boolean = state.isView;
    //const reservation: Reservation = state.reservation;

    const reserveDateInput = useRef<HTMLInputElement>(null)

    function toggleRoom(event: React.MouseEvent) {
        event.preventDefault();
        setIsRoom(true);
    }

    function toggleDesk(event: React.MouseEvent) {
        event.preventDefault();
        setIsRoom(false);
    }

    async function searchFacility(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSearch(false);
        const facilityType = isRoom ? 'R' : 'D';
        const reserveDate = reserveDateInput.current?.value;
        if (facilityType && reserveDate) {
            try {
                const response = await axios.get('reservation/timeslot', {
                    params: {
                        facilityType: facilityType,
                        reserveDate: reserveDate.toString()
                    }
                });
                setAvailableTimeSlots(response.data.timeslots);
                setIsSearch(true);
            } catch (err) {
                const error = err as AxiosError;
                const { message } = error.response?.data as { message: string };
                console.log("error ", message)
            }
        }

    }

    return (
        <>
            {isLoading && <Loader />}
            <div className="flex items-center justify-between mb-3">
                <span className="text-title-md2 font-semibold text-black dark:text-white">Reserve</span>
            </div>
            <form onSubmit={searchFacility}>
                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                        <div className="mt-4">
                            <div className="flex flex-col gap-9">
                                {/* <!-- Contact Form --> */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                                    <div className="p-6.5">
                                        <label className="mb-3 block text-black dark:text-white">
                                            Select Facility Type
                                        </label>
                                        <div className="flex w-full justify-center">
                                            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                                                <button
                                                    onClick={toggleRoom}
                                                    className={`rounded py-1 px-3 text-xl font-large hover:bg-white text-black hover:shadow-card dark:text-white dark:hover:bg-boxdark${isRoom ? 'bg-white shadow-card dark:bg-boxdark' : ''}`}>
                                                    Room
                                                </button>
                                                <button
                                                    onClick={toggleDesk}
                                                    className={`rounded py-1 px-3 text-xl font-large hover:bg-white text-black hover:shadow-card dark:text-white dark:hover:bg-boxdark${!isRoom ? 'bg-white shadow-card dark:bg-boxdark' : ''}`}>
                                                    Desk
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6.5">
                                        <label className="mb-3 block text-black dark:text-white">
                                            Select Reserve Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                min={dateString}
                                                ref={reserveDateInput}
                                                required
                                                className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <input
                                            type="submit"
                                            value="Search"
                                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
            {(availableTimeSlots && availableTimeSlots.length > 0) ? (
                <TimeSlotTable
                    availableTimeSlots={availableTimeSlots}
                    reserveDate={(reserveDateInput.current!.value).toString()}
                />
            ) : (
                (isSearch) ? (
                    <p>
                        No available facility found
                    </p>
                ) : (
                    undefined
                )
            )
            }
        </>
    );
};