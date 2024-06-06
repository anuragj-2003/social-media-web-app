// Utilities.js
import React, { useRef, useState } from "react";
import Image from "next/image";
import { XIcon } from "@heroicons/react/solid";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import PhotoIcon from "@mui/icons-material/Photo";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { db } from "./firebase";
import { storage } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import VideocamIcon from "@mui/icons-material/Videocam";

function Utilities() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const filePickerRef = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const videoPickerRef = useRef(null);

  const addVideosToPost = (e) => {
    const files = e.target.files;
    const videoPromises = [];

    for (const file of files) {
      if (file.size <= 20 * 1024 * 1024) {
        // Max size in bytes (20MB)
        videoPromises.push(
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (readerEvent) => {
              resolve({
                name: file.name,
                data_url: readerEvent.target.result,
              });
            };
          })
        );
      }
    }

    Promise.all(videoPromises).then((videos) => {
      setSelectedVideos((prevVideos) => [...prevVideos, ...videos]);
    });
  };

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        id: session.user.uid,
        username: session.user.name,
        userImg: session.user.image,
        tag: session.user.tag,
        text: input,
        timestamp: serverTimestamp(),
      });

      const imagePromises = selectedImages.map(async (selectedImage) => {
        const imageRef = ref(
          storage,
          `posts/${docRef.id}/${selectedImage.name}`
        );
        await uploadString(imageRef, selectedImage.data_url, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
      });

      const videoPromises = selectedVideos.map(async (selectedVideo) => {
        const videoRef = ref(
          storage,
          `posts/${docRef.id}/${selectedVideo.name}`
        );
        await uploadString(videoRef, selectedVideo.data_url, "data_url");
        const downloadURL = await getDownloadURL(videoRef);
        return downloadURL;
      });

      const [imageUrls, videoUrls] = await Promise.all([
        Promise.all(imagePromises),
        Promise.all(videoPromises),
      ]);

      await updateDoc(doc(db, "posts", docRef.id), {
        images: imageUrls,
        videos: videoUrls,
      });

      setLoading(false);
      setInput("");
      setSelectedImages([]);
      setSelectedVideos([]);
      setShowEmojis(false);
    } catch (error) {
      console.error("Error sending post:", error);
      setLoading(false);
    }
  };

  const addImagesToPost = (e) => {
    const files = e.target.files;
    const imagePromises = [];

    for (const file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      imagePromises.push(
        new Promise((resolve) => {
          reader.onload = (readerEvent) => {
            resolve({
              name: file.name,
              data_url: readerEvent.target.result,
            });
          };
        })
      );
    }

    Promise.all(imagePromises).then((images) => {
      setSelectedImages(images);
    });
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  return (
    <div
      className={`border border-gray-700 bg-[#202327] p-3 flex space-x-3 mt-3 overflow-y-scroll scrollbar-hide rounded-2xl ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={session.user.image}
        alt="avatar"
        className="rounded-full cursor-pointer select-none h-11 w-11"
      />
      <div className="w-full divide-y divide-gray-700">
        <div
          className={`${selectedImages.length > 0 && "pb-7"} ${
            input && "space-y-2.5"
          }`}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind?"
            rows="2"
            className="bg-transparent outline-none text-sm text-[#d9d9d9] placeholder-gray-500 tracking-wide w-full min-h-[50px]"
          />

          {selectedImages.length > 0 ? (
            <div className="mt-3">
              <div className="flex space-x-2 overflow-x-auto">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div
                      className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                      onClick={() =>
                        setSelectedImages(
                          selectedImages.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <XIcon className="h-5 text-white" />
                    </div>
                    <img
                      src={image.data_url}
                      alt={`uploaded image ${index + 1}`}
                      className="object-contain select-none rounded-2xl max-h-80"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {selectedVideos.length > 0 ? (
            <div className="mt-3">
              <div className="flex space-x-2 overflow-x-auto">
                {selectedVideos.map((video, index) => (
                  <div key={index} className="relative">
                    <video
                      controls
                      className="object-contain select-none rounded-2xl max-h-80"
                    >
                      <source src={video.data_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotoIcon className="h-[22px] select-none" />
                <input
                  type="file"
                  ref={filePickerRef}
                  accept="image/*"
                  hidden
                  multiple
                  onChange={addImagesToPost}
                />
              </div>
              <div
                className="icon"
                onClick={() => videoPickerRef.current.click()}
              >
                <VideocamIcon className="h-[22px] select-none" />
              </div>
              <input
                type="file"
                ref={videoPickerRef}
                accept="video/*"
                hidden
                multiple
                onChange={addVideosToPost}
              />
              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiEmotionsIcon className="h-[22px] select-none" />
              </div>
              {showEmojis && (  
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: -180,
                    maxWidth: "320px",    
                    borderRadius: "20px",
                    userSelect: "none",
                  }}
                  theme="dark"
                />
              )}
            </div>
            <button
              className="bg-[#d9d9d9] text-black rounded-md px-4 py-1.5 font-bold shadow-md hover:bg-[#fff] disabled:hover:bg-[rgb(247,252,255)] disabled:opacity-50 disabled:cursor-default select-none"
              disabled={
                !input &&
                selectedImages.length === 0 &&
                selectedVideos.length === 0
              }
              onClick={sendPost}
            >
              POST
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Utilities;
