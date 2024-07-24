const { useEffect, useState, useContext } = require("react");
import axios from "axios";
import Cookies from "js-cookie"

const useProfile = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get("token") || null);
    
    useEffect(() => {
        axios
          .get(`http://localhost:4000/getuser`, {
            headers: {
              authorization: "Bearer " + token,
            },
          })
          .then(({ data: res }) => {
            if (res.error) {
              alert(res.error);
              return;
            }
            setUser(res);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, [token]);

      return user;
}

export default useProfile;