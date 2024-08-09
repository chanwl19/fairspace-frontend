import Logo from '../images/logo/fairspace-logo.png';

export default function WelcomPage() {
  return (
    <>
      <h2 className="text-center text-3xl font-bold">Welcome to FairSpace</h2>
      <div className="grid justify-items-center">
        <img className="object-fit" src={Logo} alt="Logo" />
      </div>
    </>
  );
};
