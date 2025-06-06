import Logo from "../../public/Logo.png";
import { HiDotsVertical } from "react-icons/hi";

function Navbar() {
  return (
    <>
      <nav className=" h-20 flex items-center w-full ">
        <div className="w-full flex md:gap-4 items-center px-8 md:px-24 justify-between md:justify-normal ">
          <div>
            <img src={Logo} alt="Logo" className="w-[32px]" />
          </div>
          <div>
            <h1 className="font-bold text-[24px] text-[#716966]">EmptyCup</h1>
          </div>
          <div className="flex md:hidden items-center justify-center">
            <HiDotsVertical className="text-3xl" />
          </div>
        </div>
      </nav>
      <div className="bg-[#D0D0D0] h-[1px] w-full"></div>
    </>
  );
}

export default Navbar;
