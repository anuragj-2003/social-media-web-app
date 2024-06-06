import React, { useEffect, useState } from "react";
import Utilities from "./Utilities";
import { db } from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Posts from "./Posts";
function Spread() {
  const [posts, setPosts] = useState([]);
  useEffect(   
    () =>
      onSnapshot( 
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);        
        }
      ),
    [db]
  );
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  return (
    <div className="flex-grow max-w-2xl text-white sm:ml-[73px] xl:ml-[370px] mainBox rounded-2xl ">
      <div className="text-[#d9d9d9] flex items-center sm:justify-center py-2 px-3 top-0 z-50 ">
        <h2 className="font-sans text-lg font-bold cursor-pointer select-none sm:text-xl ">
          
        </h2>
      </div>
      <Utilities />
      <div className="pb-72">
        {posts.map(post => (
          <Posts key={post.id}  id={post.id} post = {post.data()}/>
        ))}
      </div>
    </div>
  );
}

export default Spread;
