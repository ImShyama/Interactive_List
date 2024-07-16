const { useEffect, useState, useContext } = require("react");
import axios from "axios";
import { UserContext } from "../context/UserContext";

const useSpreadSheetDetails = (id) => {
    const [sheetData, setSheetData] = useState(null);
    const { token} = useContext(UserContext);
    
    useEffect(() => {
        axios
          .get(`http://localhost:4000/getSheetDetails/${id}`, {
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