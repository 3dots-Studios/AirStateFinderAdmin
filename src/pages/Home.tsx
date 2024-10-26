import { NavLink } from 'react-router-dom';

export default function Home() {

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="flex flex-col w-[95%] h-[85%] md:w-[70%] md:h-[50%] md:flex-row justify-around items-center">
        <NavLink to='/due-diligence' className="bg-[#AE1729] flex rounded-md md:h-[60%] text-center justify-center items-center md:w-[30%] w-[95%] h-[30%]">
          <h1 className="text-white text-2xl">Due Diligence</h1>
        </NavLink>
        <NavLink to='/lost-lands' className="bg-[#AE1729] flex rounded-md md:h-[60%] text-center justify-center items-center md:w-[30%] w-[95%] h-[30%]">
        <h1 className="text-white text-2xl">Find Lost Land</h1>
        </NavLink >
        <NavLink to='/services' className="bg-[#AE1729] flex rounded-md md:h-[60%] text-center justify-center items-center md:w-[30%] w-[95%] h-[30%]">
        <h1 className="text-white text-2xl">Survey and Other Services</h1>
        </NavLink >
      </div>
    </div>
  );
}