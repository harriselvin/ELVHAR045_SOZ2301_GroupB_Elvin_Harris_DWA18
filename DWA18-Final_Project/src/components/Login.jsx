import React, { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";
import { Logout } from "@mui/icons-material";

export default function Login() {
    const [ user, setUser ] = useState(null)

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user);
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            switch(event) {
                case "SIGNED_IN":
                    setUser(session?.user);
                    break;
                case "SIGNED_OUT":
                    setUser(null);
                    break;
                default:
            }
        });
        return () => {
            authListener.unsubscription()
        }
    },[]);

    const login = async() => {
        await supabase.auth.signIn({
            provider: "podcast",
        });
    };

    const logout = async() => {
        await supabase.auth.signOut({
        });
    };

    return (
        <div>
            {user ? <h1>Logged In</h1> : <button onClick={Login}>Login</button>}
            <div onClick={Logout}>Logout</div>
        </div>
    );
};