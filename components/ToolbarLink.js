import React from "react";
import { useRouter } from "next/router";
import scrollbar from "./scrollbar";

function ToolbarLink({ text, Icon, active }) {
  const router = useRouter();

  const handleLinkClick = () => {
    if (text === "Explore") {
      scrollbar();
    } else if (active && text === "Home") {
      router.push("/");
    }
  };

  return (
    <div
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 justAnimate ${
        active && "font-bold"
      }`}
      onClick={handleLinkClick}
    >
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
}

export default ToolbarLink;
