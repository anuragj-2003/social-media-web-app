import React from "react";
import logo from "../assets/logo.png";
import Image from "next/image";
import ToolbarLink from "./ToolbarLink";
import { HomeIcon } from "@heroicons/react/solid";
import { HashtagIcon } from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/solid";
import { BellIcon } from "@heroicons/react/outline";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import Spread from "./Spread";
import scrollbar from "./scrollbar";
function Toolbar() {
  const { data: session } = useSession();
  const handleExploreClick = () => {
    scrollbar();
  };  
  return (
    <div className="flex-col items-center hidden sm:flex xl:items-start xl:w-[340px] p-2 fixed h-full select-none ">
      <div className="space-y-2.5 mt-5 mb-2.5 xl:ml-24 border-gray-700 bg-[#15181c] rounded-2xl p-4 sm:p-1">
        <ToolbarLink text="Home" Icon={HomeIcon} active />
        <ToolbarLink
          text="Explore"
          Icon={HashtagIcon}
          onClick={handleExploreClick}  
        />  
        <ToolbarLink text="Profile" Icon={UserIcon} />
        <ToolbarLink text="Notifications" Icon={BellIcon} />  
        <div onClick={signOut}>
          <ToolbarLink text="Logout" Icon={LogoutIcon} />
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
