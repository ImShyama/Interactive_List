import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDrivePicker from 'react-google-drive-picker'
import Cookies from 'js-cookie';
import AppCard from "./AppCard";
import axios from 'axios';
import DashboardTable from "./DashboardTable";
import updownIcon from "../assets/updownIcon.svg";
import refreshAccessToken from '../utils/refreshAccessToken'; // Import the refresh function

const clientId = '210551094674-r1bvcns06j8pj06bk8dnfhl3mh6feuag.apps.googleusercontent.com';
const developerKey = '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'; // This is actually your client secret, you should get the correct developer key from the Google Console

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const refreshToken = Cookies.get('refreshToken'); // Store the refresh token in cookies
  const [accessToken, setAccessToken] = useState(token);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // useEffect(() => {
  //   const refreshAuthToken = async () => {
  //     try {
  //       const newToken = await refreshAccessToken(refreshToken);
  //       console.log("refreshAccessToken", newToken)
  //       setAccessToken(newToken);
  //       Cookies.set('token', newToken); // Update the token cookie with the new access token
  //     } catch (error) {
  //       // navigate('/');
  //     }
  //   };

    // Optionally, you can implement a logic to check if the token is expired and then call refreshAuthToken.
    // For simplicity, calling it directly here
  //   refreshAuthToken();
  // }, [refreshToken, navigate]);

  const handleAddSheet = (data) => {

    if (data.action == "picked"){
      console.log("data",data);
    
    axios
      .post(
        "http://localhost:4000/createNewSpreadsheet",
        {
          url: data?.docs?.[0]?.url,
          spreadSheetID: data?.docs?.[0]?.id,
          appName: data?.docs?.[0]?.name
        },
        {
          headers: {
            authorization: "Bearer " + token
          },
        }
      )
      .then(({ data: res, status }) => {
        if (status === 200 && !res.error) {
          console.log("res data: ", res);
          // Redirect to edit page with the new spreadsheet ID
          navigate(`/interactivelist/${res._id}`);
        } else {
          alert(res.error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false); // Hide the loader
      });

    }
  };

  

  const [openPicker, authResponse] = useDrivePicker();  
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: "210551094674-r1bvcns06j8pj06bk8dnfhl3mh6feuag.apps.googleusercontent.com",
      developerKey: "AIzaSyBnH_ONkdpY5NAFLdy6TKe4Y6SyEGmRzwQ",
      viewId: "DOCS",
      // token: accessToken, // Use the refreshed token here
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data)

        handleAddSheet(data) 
      },
    })
  }

  return (
    <div>
      <div className="flex justify-between px-[50px] py-[5px]">
        <div>
          <button className="bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]" onClick={() => handleOpenPicker()}>
          <span className="text-[var(--white,#FFF)] font-poppins text-[14px] font-normal leading-normal">+ Create app from zero</span>
          </button>
        </div>
        <div>
          <button className="flex gap-[10px] justify-center items-center flex-shrink-0 text-center bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]">
          <span className="text-[var(--white,#FFF)] font-poppins text-[14px] font-medium leading-normal">More apps</span> <img src={updownIcon} className="w-[8px] h-[13px] flex-shrink-0" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <AppCard />
        <AppCard />
        {/* <AppCard />
        <AppCard /> */}
      </div>
      <DashboardTable />
    </div>
  );
};

export default Dashboard;
