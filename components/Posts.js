import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { TrashIcon } from "@heroicons/react/outline";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ChatIcon from "@mui/icons-material/Chat";
import RepeatIcon from "@mui/icons-material/Repeat";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Moment from "react-moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db } from "./firebase";
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import { postIdState } from "@/atoms/modalAtom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

function Posts({ id, post, postpage }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [disliked, setDisliked] = useState(false);
  const [dislikes, setDislikes] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
      setLikes(snapshot.docs)
    );
    onSnapshot(collection(db, "posts", id, "dislikes"), (snapshot) =>
      setDislikes(snapshot.docs)
    );
  }, [db, id]);

  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
    setDisliked(
      dislikes.findIndex((dislike) => dislike.id === session?.user?.uid) !== -1
    );
  }, [likes, dislikes]);

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
      if (disliked) {
        await deleteDoc(doc(db, "posts", id, "dislikes", session.user.uid));
      }
    }
  };

  const dislikePost = async () => {
    if (disliked) {
      await deleteDoc(doc(db, "posts", id, "dislikes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "dislikes", session.user.uid), {
        username: session.user.name,
      });
      if (liked) {
        await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
      }
    }
  };

  function MediaSlider({ media }) {
    const sliderSettings = {
      dots: false,
      infinite: false,
      speed: 700,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
  
    return (
      <div className="w-[80%]">
        <div className="max-w-[700px] mx-auto relative">
          <Slider {...sliderSettings}>
                
            {media.map((item, index) => (
              <div key={index} className="w-full h-[400px]">
                {item.type === "image" ? (
                  <img  
                    src={item.url} 
                    alt={`media ${index + 1}`}
                    className="object-contain object-center w-full h-full rounded-2xl"
                  />
                ) : (
                  <video
                    controls
                    className="object-contain object-center w-full h-full rounded-2xl"
                  >
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }

      
  return (  
    <div
      className="flex p-3 py-3 mt-3 cursor-pointer rounded-3xl bg-[#272829]"
      // onClick={() => router.push(`/${id}`)}
    >
      {!postpage && (
        <img
          src={post?.userImg}
          alt=" "
          className="mr-4 rounded-full select-none h-11 w-11"
        />
      )}
      <div className="flex flex-col w-full space-y-2">
        <div className={`flex ${!postpage && "justify-between"}`}>
          {postpage && (
            <img
              src={post?.userImg}
              alt="avatar"
              className="mr-4 rounded-full select-none h-11 w-11"
            />
          )}
          <div className="text-gray-400">
            <div className="inline-block group">
              <h4
                className={`text-[15px] font-bold sm:text-base select-none group-hover:text-white ${
                  !postpage && "inline-block"
                }`}
              >
                @{post?.tag}
              </h4>
            </div>
            {" - "}
            <span className="text-sm hover:text-white sm:text-[15px] select-none">
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postpage && (
              <p className="text-[15px] text-white sm:text-base mt-2">
                {post?.text}
              </p>
            )}
          </div>
          <div
            className="flex-shrink-0 ml-auto icon group"
            onClick={() => router.push(`/${id}`)}
            title="View Comments"
          >
            <RemoveRedEyeIcon
              className={`h-5 text-[#6e767d] group-hover:text-[white] text-base ${
                post?.images && post.images.length > 1 ? " mr-28 " : ""
              }`}
            />
          </div>
        </div>
        {postpage && <p className="text-[white] mt-1 text-xl">{post?.text}</p>}



        
        <div className="w-full max-w-[700px] mx-auto">
  {/* Display solo image */}
  {post?.images && post.images.length === 1 && (
    <div className="max-h-[700px]">
      <img
        src={post.images[0]}
        alt={`image 1`}
        className="object-cover w-full h-full select-none rounded-2xl"
      />
    </div>
  )}

  {/* Display solo video */}
  {post?.videos && post.videos.length === 1 && !post?.images && (
    <div className="max-h-[700px]">
      <video
        controls
        className="object-contain w-full h-full rounded-2xl"
      >
        <source src={post.videos[0]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )}



  {/* Display images and videos in slider */}
  {(post?.images && post.images.length > 1) || (post?.videos && post.videos.length > 0) ? (
    <MediaSlider
      media={[
        ...post.images.map((url) => ({ type: "image", url })),
        ...post.videos.map((url) => ({ type: "video", url })),
      ]}
    />
  ) : null}
</div>







        <div
          // style={{ pointerEvents: "none" }}
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postpage && "mx-auto"
          }`}
        >
          {/* Like Button */}
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <ThumbUpIcon className="h-5 text-blue-600" />
              ) : (
                <ThumbUpIcon className="h-5 group-hover:text-blue-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-white text-sm ${
                  liked && "text-white"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          {/* Dislike Button */}
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dislikePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {disliked ? (
                <ThumbDownAltIcon className="h-5 text-red-600" />
              ) : (
                <ThumbDownAltIcon className="h-5 group-hover:text-red-600" />
              )}
            </div>
            {dislikes.length > 0 && (
              <span
                className={`group-hover:text-white text-sm ${
                  liked && "text-white"
                }`}
              >
                {dislikes.length}
              </span>
            )}
          </div>

          {/* Comments Button */}
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
              console.log("isOpen set to true");
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div> 
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {/* Delete or Repost Button */}
          {session.user.uid === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <RepeatIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;
