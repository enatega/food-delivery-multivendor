import { useAuth } from "@/lib/context/auth/auth.context";
import { useTranslations } from "next-intl";
import React from "react";

const LoginInForSavedAddresses = ({ handleModalToggle }) => {
    const { authToken } = useAuth();
    const t = useTranslations();
    return (
        <div>
            <button className="underline" onClick={handleModalToggle}>
                {!authToken ?  t('LoginForSavedAddresses.loginPrompt') : t('LoginForSavedAddresses.viewSavedAddresses')}
            </button>
        </div>
    );
};

export default LoginInForSavedAddresses;
