import { SearchIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";

function LoggedinProfile({ trendingResults, followResults }) {
  const { data: session } = useSession();
  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5 mt-[16px]">
      <div className="sticky top-5 py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
        <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
          <SearchIcon className="z-50 h-5 text-gray-500" />
          <input
            type="text"
            className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
            placeholder="Search People"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12 sticky top-20">
        <img
          src={session.user?.image}
          className="object-contain w-24 h-24 mt-2 rounded-full select-none"
          alt="Profile"
        />
        <h4 className="mt-2 mb-0 text-xl font-bold text-center select-none sm:text-[16px]">
          {session.user.name} - @{session.user.tag}
        </h4>
        <h4 className="text-center select-none sm:text-[12px] text-[14px] ">{session.user.email}</h4>
        <button className="mt-4 hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out w-full text-[#1d9bf0] font-light">
          Your Profile
        </button>
      </div>
    </div>
  );
}

export default LoggedinProfile;
