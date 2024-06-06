import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import PhotoIcon from "@mui/icons-material/Photo";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "./firebase";
import { useSession } from "next-auth/react";
import { XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Moment from "react-moment";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

function Modal() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const router = useRouter();
  const [showEmojis, setShowEmojis] = useState(false);

  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot.data());
    });
  }, [postId]);

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    setIsOpen(false);
    setComment("");
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setComment(comment + emoji);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 pt-8" onClose={setIsOpen}>
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block text-left align-bottom transition-all transform bg-black shadow-xl rounded-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="flex items-center justify-between p-2 px-1.5 py-2 bg-[#202327]">
                <div>
                  <span className="ml-6 select-none ">Comments</span>
                </div>
                <div
                  className="flex items-center justify-center hoverAnimation w-9 h-9 xl:px-0 justAnimate"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-[22px] text-white cursor-pointer" />
                </div>
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    <img
                      src={post?.userImg}
                      alt=""
                      className="rounded-full h-11 w-11"
                    />
                    <div>
                      <div className="inline-block group">
                        <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base">
                          @{post?.tag}{" "}
                        </h4>
                      </div>{" "}
                      ·{" "}
                      <span className="hover:underline text-sm sm:text-[15px]">
                        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                      </span>
                      <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                        {post?.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full space-x-3 mt-7">
                    <img
                      src={session.user.image}
                      alt=""
                      className="rounded-full h-11 w-11"
                    />
                    <div className="flex-grow mt-2">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Your Comments"
                        rows="2"
                        className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                      />
                      <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                          <div className="icon">
                            <PhotoIcon className="text-white h-[22px]" />
                          </div>
                          <div className="icon">
                            <EmojiEmotionsIcon
                              className="text-white h-[22px]"
                              onClick={() => setShowEmojis(!showEmojis)}
                            />
                          </div>
                        </div>
                        <button
                          className="bg-[#d9d9d9] text-black rounded-md px-4 py-1.5 font-bold shadow-md hover:bg-[#fff]
                          disabled:hover:bg-[rgb(247,252,255)] disabled:opacity-50 disabled:cursor-default select-none "
                          type="submit"
                          onClick={sendComment}
                          disabled={!comment.trim()}
                        >
                          Reply
                        </button>
                      </div>
                      {showEmojis && (
                        <Picker
                          onSelect={addEmoji}
                          style={{
                            position: "absolute",
                            marginTop: "5px",
                            marginLeft: "-10px",
                            maxWidth: "320px",
                            borderRadius: "20px",
                            userSelect: "none",
                          }}
                          theme="dark"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;
