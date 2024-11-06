const { useEffect, useState, useContext } = require("react");
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { HOST } from "./constants";

const useSpreadSheetDetails = (id) => {
    const [sheetData, setSheetData] = useState(null);
    const { token} = useContext(UserContext);
    
    useEffect(() => {
        axios
          .get(`${HOST}/getSheetDetails/${id}`, {
            headers: {
              authorization: "Bearer " + token,
            },
          })
          .then(({ data: res }) => {
            if (res.error) {
              alert(res.error);
              return;
            }
            setSheetData(res);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, []);

      return sheetData;
}

export default useSpreadSheetDetails;