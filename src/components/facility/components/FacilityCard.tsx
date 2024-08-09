import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import { AxiosError } from 'axios';
import axios from '../../../http/axios';
import { Facility } from '../../../models/Facility';
import { NavLink } from 'react-router-dom';

type FacilityCardProps = {
    facility: Facility;
    inactiveFacilityHandler: () => void;
    errorMsgHandler: (msg: string) => void;
    loadingHanlder: (loading: boolean) => void;
};


export default function FacilityCard({ facility, inactiveFacilityHandler, errorMsgHandler, loadingHanlder }: FacilityCardProps) {

    async function inactiveFacility() {
        loadingHanlder(true);
        const facilityId = facility._id.toString();
        try {
            await axios.delete('facility', { data: JSON.stringify({ _id: facilityId }) });
            inactiveFacilityHandler();
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
                        {facility.location}
                    </h4>
                    <div>
                        <label>Facility Type : </label>
                        <span>{facility.type === 'D' ? 'Desk' : 'Room'}</span>
                    </div>
                    <div>
                        <label>Opening Hours : </label>
                        <span>{facility.openTime} : {facility.closeTime}</span>
                    </div>
                    {facility.type === 'D' &&
                        <div>
                            <label>Seat Number : </label>
                            <span>{facility.seatNumber}</span>
                        </div>
                    }
                    {facility.type === 'R' &&
                        <div>
                            <label>Capacity : </label>
                            <span>{facility.capacity}</span>
                        </div>
                    }
                </div>
                <div className="flex justify-end gap-4.5">
                    {facility.status === 'A' &&
                        (
                            <>
                                <NavLink
                                    to={{ pathname: '/editFacility' }}
                                    state={{ isNew: false, facility: facility }}
                                >
                                    <BsFillPencilFill className="delete-btn cursor-pointer"/>
                                </NavLink>
                                <BsFillTrashFill className="delete-btn cursor-pointer" onClick={inactiveFacility} />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
