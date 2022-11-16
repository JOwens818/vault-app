import React, { useEffect, useContext, createContext, useState } from "react";
import { useRouter } from "next/router";
import { fetcher } from "lib/utils/apiFetcher";


const authContext = createContext();

export const AuthProvider = ({children}) => {
  const auth = userProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export const userAuth = () => {
  return useContext(authContext);
};

const userProvideAuth = () => {
  const router = useRouter();
  const [authLoading, setAuthLoading ] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const validateJwt = async () => {
      if (window &&
        router.isReady &&
        router.pathname != '/404'
      ) {
        setAuthLoading(true);
        const validationResp = await fetcher("validateJwt", "/api/auth/validate-token", "GET");
        if (validationResp.status !== "success") {
          if (router.pathname != "/login") {
            router.push("/login");
          }
        } else {
          setUsername(validationResp.data.username);
          if (validationResp.data.username !== "admin" && router.pathname === "/admin") {
            router.push("/");
          }
          if (validationResp.data.username === "admin" && router.pathname !== "/admin") {
            router.push("/admin");
          }
        }
      }
      setAuthLoading(false);
    }
    validateJwt();
  }, [router.pathname]);

  return { username, authLoading };
}
