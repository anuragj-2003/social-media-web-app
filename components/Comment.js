import { ChartBarIcon, HeartIcon, ShareIcon } from "@heroicons/react/outline";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import Moment from "react-moment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import PhotoIcon from "@mui/icons-material/Photo";

function Comment({ comment }) {
  return (
    <div className="flex p-3 border-b border-gray-700 cursor-pointer">
      <img
        src={comment?.userImg}
        alt=""
        className="mr-4 rounded-full h-11 w-11"
      />
      <div className="flex flex-col w-full space-y-2">
        <div className="flex justify-between">
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block ">
                @{comment?.tag}{" "}
              </h4>
            </div>{" "}
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
            <p className="text-[#d9d9d9] mt-0.5 max-w-lg overflow-scroll text-[15px] sm:text-base">
              {comment?.comment}
            </p>
          </div>
          {/* <div className="flex-shrink-0 icon group">
            <VisibilityOffIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div> */}
        </div>

        <div className="text-[#6e767d] flex justify-between w-10/12">
          <div className="icon group">
            <ThumbUpIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>

          <div className="flex items-center space-x-1 group">
            <div className="icon group-hover:bg-pink-600/10">
              <ThumbDownAltIcon className="h-5 group-hover:text-red-600" />
            </div>
            <span className="text-sm group-hover:text-pink-600"></span>
          </div>

          <div className="icon group">
            <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <DeleteIcon className="h-5 group-hover:text-red-700 " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
