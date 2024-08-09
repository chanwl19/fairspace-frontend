import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Loader from '../../../common/loader';
import { AxiosError } from 'axios';
import { Facility } from '../../../models/Facility';
import useAxios from '../../../hooks/useAxios';
import ErrorAlert from '../../uiElements/ErrorAlert';

export default function EditFacility() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRoom, setIsRoom] = useState<boolean>(true);
    const [isSelectedOpen, setIsSelectedOpen] = useState<boolean>(false);
    const [isSelectedClose, setIsSelectedClose] = useState<boolean>(false);
    const [facilityOpenHour, setFacilityOpenHour] = useState<string>('');
    const [facilityCloseHour, setFacilityCloseHour] = useState<string>('');
    const [closeTimeOptions, setCloseTimeOptions] = useState<Date[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const editFacilityOpenTime = new Date();
    const editFacilityCloseTime = new Date();
    const locationInput = useRef<HTMLInputElement>(null);
    const capacityInput = useRef<HTMLInputElement>(null);
    const seatNumberInput = useRef<HTMLInputElement>(null);
    const openTimeInput = useRef<HTMLSelectElement>(null);
    const closeTimeInput = useRef<HTMLSelectElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const facility: Facility = state.facility;
    const isNew: boolean = state.isNew;
    const openTimes: Date[] = [];
    const axiosWithHeader = useAxios();

    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(startTime.getTime());
    endTime.setHours(endTime.getHours() + 24);
    while (startTime < endTime) {
        openTimes.push(new Date(startTime));
        startTime.setMinutes(startTime.getMinutes() + 30);
    }

    //const location = useLocation();
    //const authCtx = useContext(AuthContext);
    //const user = authCtx.user;

    useEffect(() => {
        if (!isNew && facility) {
            setIsRoom(facility.type === 'R');
            const openTimeArray = (facility.openTime.split(':')).map(Number);
            const closeTimeArray = (facility.closeTime.split(':')).map(Number);
            editFacilityOpenTime.setHours(openTimeArray[0], openTimeArray[1], 0, 0);
            editFacilityCloseTime.setHours(closeTimeArray[0], closeTimeArray[1], 0, 0);
            setOpenTimeHandler(editFacilityOpenTime.toString());
            setCloseTimeHandler(editFacilityCloseTime.toString());
        }
    }, []);

    function changeOpenTime(event: React.FormEvent<HTMLSelectElement>) {
        event.preventDefault();
        const openTimeStr = event.currentTarget.value;
        setOpenTimeHandler(openTimeStr);
    }

    function setOpenTimeHandler(openTimeStr: string) {
        setIsSelectedOpen(false);
        setIsSelectedClose(false);
        setFacilityCloseHour("");
        if (openTimeStr) {
            const selectedOpenTime = new Date(openTimeStr);
            setFacilityOpenHour(openTimeStr);
            setIsSelectedOpen(true);
            setCloseTimeOptions(openTimes.filter(openTime => {
                return openTime.getTime() > selectedOpenTime.getTime()
            }))
            closeTimeOptions.push(new Date((new Date(selectedOpenTime.getTime())).setHours(0, 0, 0, 0)));
        }
    }

    function changeCloseTime(event: React.FormEvent<HTMLSelectElement>) {
        event.preventDefault();
        const closeTimeStr = event.currentTarget.value;
        setIsSelectedClose(false);
        setCloseTimeHandler(closeTimeStr);
    }

    function setCloseTimeHandler(closeTimeStr: string) {
        if (closeTimeStr) {
            setFacilityCloseHour(closeTimeStr);
            setIsSelectedClose(true);
        }
    }


    function toggleRoom(event: React.MouseEvent) {
        event.preventDefault();
        setIsRoom(true);
    }

    function toggleDesk(event: React.MouseEvent) {
        event.preventDefault();
        setIsRoom(false);
    }

    async function submitFacility(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        const facilityType = isRoom ? 'R' : 'D';
        const selectedOpenTimeStr = openTimeInput.current!.value;
        const selectedCloseTimeStr = closeTimeInput.current!.value;
        const location = locationInput.current?.value;
        const capacity = capacityInput.current?.value;
        const seatNumber = seatNumberInput.current?.value;
        const openTime = new Date(selectedOpenTimeStr);
        const closeTime = new Date(selectedCloseTimeStr);
        try {
            if (isNew) {
                await axiosWithHeader.post('facility',
                    JSON.stringify({
                        location: location,
                        type: facilityType,
                        openTime: openTime.getHours().toString().padStart(2, '0') + ':' + openTime.getMinutes().toString().padStart(2, '0'),
                        closeTime: closeTime.getHours().toString().padStart(2, '0') + ':' + closeTime.getMinutes().toString().padStart(2, '0'),
                        capacity: capacity,
                        seatNumber: seatNumber
                    })
                );
            } else {
                await axiosWithHeader.patch('facility',
                    JSON.stringify({
                        _id: facility._id.toString(),
                        location: location,
                        type: facilityType,
                        openTime: openTime.getHours().toString().padStart(2, '0') + ':' + openTime.getMinutes().toString().padStart(2, '0'),
                        closeTime: closeTime.getHours().toString().padStart(2, '0') + ':' + closeTime.getMinutes().toString().padStart(2, '0'),
                        capacity: capacity,
                        seatNumber: seatNumber
                    })
                );
            }
            setIsLoading(false);
            navigate("/facility");
        } catch (err) {
            const error = err as AxiosError;
            const { message } = error.response?.data as { message: string };
            setErrorMsg(message);
            setIsLoading(false);
        }
    }

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
                <span className="text-title-md2 font-semibold text-black dark:text-white">Facility</span>
            </div>
            <form onSubmit={submitFacility}>
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
                                            Enter Facility Location
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                ref={locationInput}
                                                required
                                                defaultValue={facility?.location}
                                                className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {isRoom &&
                                        <div className="p-6.5">
                                            <label className="mb-3 block text-black dark:text-white">
                                                Enter Room Capacity
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    ref={capacityInput}
                                                    required
                                                    defaultValue={facility?.capacity + ''}
                                                    className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    }

                                    {!isRoom &&
                                        <div className="p-6.5">
                                            <label className="mb-3 block text-black dark:text-white">
                                                Enter Seat Number
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    ref={seatNumberInput}
                                                    required
                                                    defaultValue={facility?.seatNumber + ''}
                                                    className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    }

                                    <div className="flex flex-col gap-5.5 p-6.5">
                                        <label className="mb-3 block text-black dark:text-white">
                                            Select Open Time
                                        </label>
                                        <div className="relative z-20 bg-white dark:bg-form-input">
                                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </span>
                                            <select
                                                ref={openTimeInput}
                                                value={facilityOpenHour}
                                                required
                                                onChange={changeOpenTime}
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                <option value="">Please select Open Time</option>
                                                {openTimes.map((openTime, index) => {
                                                    const display = openTime.getHours().toString().padStart(2, '0') + ':' + openTime.getMinutes().toString().padStart(2, '0');
                                                    return (
                                                        <option value={openTime.toString()} key={index}>{display}</option>
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

                                    {(isSelectedOpen && closeTimeOptions && closeTimeOptions.length > 0) &&
                                        <div className="flex flex-col gap-5.5 p-6.5">
                                            <label className="mb-3 block text-black dark:text-white">
                                                Select Close Time
                                            </label>
                                            <div className="relative z-20 bg-white dark:bg-form-input">
                                                <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </span>
                                                <select
                                                    ref={closeTimeInput}
                                                    value={facilityCloseHour}
                                                    required
                                                    onChange={changeCloseTime}
                                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                    <option value="">Please select Close Time</option>
                                                    {closeTimeOptions.map((closeTime, index) => {
                                                        const display = closeTime.getHours().toString().padStart(2, '0') + ':' + closeTime.getMinutes().toString().padStart(2, '0');
                                                        return (
                                                            <option value={closeTime.toString()} key={index}>{display}</option>
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
                                    }

                                    {(isSelectedOpen && isSelectedClose) &&
                                        <div className="mb-5">
                                            <input
                                                type="submit"
                                                value={isNew ? "Submit" : "Save"}
                                                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
        </>
    );
};