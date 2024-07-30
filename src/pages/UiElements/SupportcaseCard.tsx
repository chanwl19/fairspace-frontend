import {  BsEyeFill } from 'react-icons/bs';
import { SupportCase } from '../../models/SupportCase';

type SupportCaseCard = {
  supportCase: SupportCase;
};

export default function ReservationCard({ supportCase }: SupportCaseCard) {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {supportCase.subject}
          </h4>
          <p>Open at : {supportCase.openDate.toDateString()}</p>
          <p>Resolve at : {supportCase.resolveDate?.toDateString() || ''}</p>
          <p>Close at : {supportCase.closeDate?.toDateString() || ''}</p>
        </div>
        <div className="flex justify-end gap-4.5">
          <BsEyeFill className="delete-btn cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
