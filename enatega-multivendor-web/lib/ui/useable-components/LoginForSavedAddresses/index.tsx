import { useAuth } from "@/lib/context/auth/auth.context";
import React from "react";

const LoginInForSavedAddresses = ({ handleModalToggle }) => {
    const { authToken } = useAuth();
    return (
        <div>
            <button className="underline" onClick={handleModalToggle}>
                {!authToken ?  "Login for saved address" : "View saved addresses"}
            </button>
        </div>
    );
};

export default LoginInForSavedAddresses;
