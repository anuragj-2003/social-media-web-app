import Image from "next/image";
import React from "react";
import logo from "../assets/logo.png";
import { signIn } from "next-auth/react";
function Login({ providers }) {
  return (
    <div className="flex flex-col items-center pt-48 space-y-20">
      <Image src={logo} width={150} height={150} objectFit="contain" />

      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="relative px-6 py-3 overflow-hidden font-medium rounded tran-black sition-all"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))} 
      </div>
    </div>
  );
}

export default Login;
