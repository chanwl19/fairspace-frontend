import { NavLink } from 'react-router-dom';
import { SupportCase } from '../../models/SupportCase';
import SupportCaseCard from '../UiElements/SupportcaseCard';

export default function Support() {
  const supportCases: SupportCase[] = [];
  const supportCase1 = new SupportCase();
  const supportCase2 = new SupportCase();
  const supportCase3 = new SupportCase();

  supportCase1._id =Object("1");
  supportCase2._id =Object("1");
  supportCase3._id =Object("3");

  supportCase1.subject ="Cannot reserve A1-21";
  supportCase2.subject ="The computer is so slow";
  supportCase3.subject ="Scanner not working";

  supportCase1.openDate = new Date('2024-07-31T15:28:00');
  supportCase2.openDate = new Date('2024-07-28T15:12:00');
  supportCase3.openDate = new Date('2024-07-22T10:12:00');

  supportCase2.resolveDate = new Date('2024-07-28T16:12:00');
  supportCase3.resolveDate = new Date('2024-07-22T13:12:00');

  supportCase3.closeDate = new Date('2024-07-22T13:15:00');

  supportCases.push(supportCase1);
  supportCases.push(supportCase2);
  supportCases.push(supportCase3);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-title-md2 font-semibold text-black dark:text-white">
          Support
        </span>
        <NavLink
          to={{ pathname: '/editSupport' }}
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
            Create
          </span>
        </NavLink>
      </div>
      {supportCases && supportCases.length > 0 ? (
        supportCases.map((supportCase: SupportCase, index) => {
          return (
            <ul key={index}>
              <SupportCaseCard supportCase={supportCase} />
            </ul>
          );
        })
      ) : (
        <p>No Support Case was found</p>
      )}
    </>
  )
}