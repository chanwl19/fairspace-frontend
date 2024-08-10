import { useState, useContext, useRef } from 'react';
import { AvailableTimeSlot } from '../../../models/AvailableTimeSlot';
import { AuthContext } from '../../../context/AuthContext';
import { AxiosError } from 'axios';
//import axios from '../../http/axios';
import { useNavigate } from "react-router-dom";
import useAxios from '../../../hooks/useAxios';

type TimeSlotTableProps = {
    availableTimeSlots: AvailableTimeSlot[];
    loadingHandler: (loading: boolean) => void;
    errorMsgHandler: (errorMsg: string) => void
};


export default function TimeSlotTable({ availableTimeSlots, loadingHandler, errorMsgHandler }: TimeSlotTableProps) {

    const [startTimes, setStartTimes] = useState<Date[]>([]);
    const [endTimes, setEndTimes] = useState<Date[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<AvailableTimeSlot>(new AvailableTimeSlot());
    const [isSelectedFacility, setIsSelectedFacility] = useState<boolean>(false);
    const [isSelectedStartTime, setIsSelectedStartTime] = useState<boolean>(false);
    const reserveStartDt = useRef<HTMLSelectElement>(null);
    const reserveEndDt = useRef<HTMLSelectElement>(null);
    const authCtx = useContext(AuthContext);
    const user = authCtx.user;
    const navigate = useNavigate();
    const axiosWithHeader = useAxios();

    // const openTimeArr = availableTimeSlots.sort((prevRecord, record) => {
    //     return Number(prevRecord.facility.openTime.replace(':', '')) - Number(record.facility.openTime.replace(':', ''))
    // }
    // );
    // const minOpenTimeArr = openTimeArr[0].facility.openTime.split(':').map(Number);

    // const closeTimeArr = availableTimeSlots.sort((prevRecord, record) => {
    //     return Number(record.facility.closeTime.replace(':', '')) - Number(prevRecord.facility.closeTime.replace(':', ''))
    // });
    // const maxCloseTimeArr = closeTimeArr[0].facility.closeTime.split(':').map(Number);

    // const tableStartDt = new Date(reserveDate);
    // const tableEndDt = new Date(reserveDate);

    // tableStartDt.setHours(minOpenTimeArr[0], minOpenTimeArr[1], 0, 0);
    // tableEndDt.setHours(maxCloseTimeArr[0], maxCloseTimeArr[1], 0, 0);

    // const timeSlots = [];
    // while (tableStartDt < tableEndDt) {
    //     timeSlots.push(new Date(tableStartDt));
    //     tableStartDt.setMinutes(tableStartDt.getMinutes() + 30);
    // }
    function changeFacility(event: React.FormEvent<HTMLSelectElement>) {
        event.preventDefault();
        const facilityId = event.currentTarget.value;
        setIsSelectedFacility(false);
        setIsSelectedStartTime(false);
        if (facilityId) {
            const facility = availableTimeSlots.find(availableTimeSlot => availableTimeSlot.facility._id.toString() === facilityId);
            const availableStartTimes: Date[] = [];
            facility?.timeSlots.map(timeSlot => {
                availableStartTimes.push(new Date(timeSlot.startDt!.toString()));
            })
            setSelectedFacility(facility || new AvailableTimeSlot());
            setStartTimes(availableStartTimes);
            setIsSelectedFacility(true);
        }

    }

    function changeStartTime(event: React.FormEvent<HTMLSelectElement>) {
        event.preventDefault();
        const timeStr = event.currentTarget.value;
        if (timeStr) {
            setIsSelectedStartTime(true);
            const selectedStartTime = new Date(event.currentTarget.value);
            const calEndTimes: Date[] = [];
            selectedFacility.timeSlots.map(timeSlot => {
                const endTime = new Date(timeSlot.endDt!.toString());
                calEndTimes.push(endTime);
            })
            let isBroken = false;
            setEndTimes(calEndTimes.filter((endTime, index) => {
                if (endTime.getTime() > selectedStartTime.getTime()) {
                    if ((index < calEndTimes.length - 1) && !isBroken) {
                        const endTimeCopy = new Date(endTime.getTime());
                        const nextEndTimeCopy = new Date(calEndTimes[index + 1].getTime());
                        endTimeCopy.setMinutes(endTime.getMinutes() + 30);
                        if (endTimeCopy.getTime() !== nextEndTimeCopy.getTime()) {
                            isBroken = true;
                            return true;
                        }
                    }
                    return !isBroken
                }
                return false
            }
            ));
        } else {
            setIsSelectedStartTime(false);
        }
    }

    async function reserveFacility(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        loadingHandler(true);
        const userId = user?.userId;
        const facilityId = selectedFacility.facility._id.toString();
        const startDt = reserveStartDt.current?.value;
        const endDt = reserveEndDt.current?.value;

        if (userId && facilityId && startDt && endDt) {
            const reserveStartDate = new Date(startDt);
            const reserveEndDate = new Date(endDt);

            try {
                await axiosWithHeader.post('reservation',
                    JSON.stringify({
                        userId: userId,
                        facilityId: facilityId,
                        reserveStartDt: reserveStartDate.toUTCString(),
                        reserveEndDt: reserveEndDate.toUTCString()
                    }));
                loadingHandler(false);
                navigate("/reservation");
            } catch (err) {
                const error = err as AxiosError;
                const { message } = error.response?.data as { message: string };
                loadingHandler(false);
                errorMsgHandler(message);
            }
        }
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Available TimeSlots
            </h4>
            <form onSubmit={reserveFacility}>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <label className="mb-3 block text-black dark:text-white">
                        Select Facility
                    </label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                        </span>
                        <select
                            required
                            onChange={changeFacility}
                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                            <option value="">Please select a facility</option>
                            {availableTimeSlots.map((availableTimeSlot, index) => {
                                return (
                                    <option value={availableTimeSlot.facility._id.toString()} key={index}>{availableTimeSlot.facility.location}</option>
                                )
                            })}
                        </select>
                        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                    </div>
                </div>
                {(isSelectedFacility && startTimes && startTimes.length > 0) &&
                    (
                        <div className="flex flex-col gap-5.5 p-6.5">
                            <label className="mb-3 block text-black dark:text-white">
                                Select Start Time
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                                <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </span>
                                <select
                                    ref={reserveStartDt}
                                    required
                                    onChange={changeStartTime}
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                    <option value="">Please select Start Time</option>
                                    {startTimes.map((startTime, index) => {
                                        const display = startTime.getUTCHours().toString().padStart(2, '0') + ':' + startTime.getUTCMinutes().toString().padStart(2, '0');
                                        return (
                                            <option value={startTime.toUTCString()} key={index}>{display}</option>
                                        )
                                    })}
                                </select>
                                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    )}
                {(isSelectedStartTime && endTimes && endTimes.length > 0) &&
                    (
                        <>
                            <div className="flex flex-col gap-5.5 p-6.5">
                                <label className="mb-3 block text-black dark:text-white">
                                    Select End Time
                                </label>
                                <div className="relative z-20 bg-white dark:bg-form-input">
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </span>
                                    <select
                                        ref={reserveEndDt}
                                        required
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option value="">Please select End Time</option>
                                        {endTimes.map((endTime, index) => {
                                            const display = endTime.getUTCHours().toString().padStart(2, '0') + ':' + endTime.getUTCMinutes().toString().padStart(2, '0');
                                            return (
                                                <option value={endTime.toUTCString()} key={index}>{display}</option>
                                            )
                                        })}
                                    </select>
                                    <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="mb-5">
                                <input
                                    type="submit"
                                    value="Reserve"
                                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                />
                            </div>
                        </>
                    )
                }
            </form>
        </div >
    );
};