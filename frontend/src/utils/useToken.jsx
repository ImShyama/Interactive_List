import { useState } from 'react';
import Cookies from "js-cookie"

const useToken = () => {
    const [token, setToken] = useState(Cookies.get("token") || null);
    return token;
}

export default useToken;