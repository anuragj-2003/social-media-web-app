import Spread from "@/components/Spread";
import Toolbar from "@/components/Toolbar";
import Head from "next/head";
import { getProviders, getSession, useSession } from "next-auth/react"; 
import Login from "@/components/Login";
import LoggedinProfile from "@/components/LoggedinProfile";
import Modal from "@/components/Modal"; 
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";

export default function Home({ providers }) {
  const { data: session } = useSession();     
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  if (!session) return <Login providers={providers} />;

  return (  
    <div>
      <Head>
        <title>CODERSCHUCK</title>
      </Head>
      <main className="flex min-h-screen max-w-[1500px] mx-auto bg-black">
        <Toolbar />
        <Spread />
        <LoggedinProfile/>
        {/* Widgets */}
        {isOpen && <Modal/>}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);  

  return {
    props: {
      providers,
      session,
    },
  };
}
