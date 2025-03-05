import React, { useContext, useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { FaLinkSlash } from "react-icons/fa6";
import "./InfoCard.css";
// import linkContext from "../../context/links/linkContext";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";
import { spread } from "lodash";

const InfoCard = ({ users, spreadSheet }) => {
  // const context = useContext(linkContext);
  // let {
  //   getLinksCount,
  //   linkCount,
  //   userLogs,
  //   getUserLogs,
  //   getLinksLogs,
  //   linksLogs,
  // } = context;

  // const [userCount, setUserCount] = useState(0);
  // const [loadingUsers, setLoadingUsers] = useState(true);

  // function logProgress(percentage) {
  //   const integerPart = Math.floor(percentage);
  //   if (percentage < 0) return Math.min(integerPart * -1, 100);
  //   return Math.min(integerPart, 100);
  // }

  // useEffect(() => {
  //   getUserLogs();
  //   getLinksCount();
  //   getLinksLogs();
  //   // if (users) {
  //   //   setUserCount(users?.length);
  //   //   setLoadingUsers(false);
  //   // }
  // }, []);
  let linksLogs, userLogs, linkCount;
  const logProgress = (percentage) => {
    const integerPart = Math.floor(percentage);
    if (percentage < 0) return Math.min(integerPart * -1, 100);
    return Math.min(integerPart, 100);
  }

  const infoCardValues = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayUser = users.filter(user => {
      if (!user.createdAt) return false;
      const createdAtDate = new Date(user.createdAt);
      return createdAtDate >= today;
    }).length;

    const yesterdayUserCount = users.filter(user => {
      if (!user.createdAt) return false;
      const createdAtDate = new Date(user.createdAt);
      return createdAtDate >= yesterday && createdAtDate < today;
    }).length;

    const todayLinks = spreadSheet.filter(link => {
      if (!link.createdAt) return false;
      const createdAtDate = new Date(link.createdAt);
      return createdAtDate >= today;
    }).length;

    const yesterdayLinkCount = spreadSheet.filter(user => {
      if (!user.createdAt) return false;
      const createdAtDate = new Date(user.createdAt);
      return createdAtDate >= yesterday && createdAtDate < today;
    }).length;

    console.log(todayUser, todayLinks, yesterdayUserCount, yesterdayLinkCount);

    return {
      userCount: todayUser,
      linkCount: todayLinks,
      linkPercentage: ((todayLinks - yesterdayLinkCount) / yesterdayLinkCount) * 100,
      UserPercentage: ((todayUser - yesterdayUserCount) / yesterdayUserCount) * 100
    }
  }

  return (
    <div>
      <div className="card-container">
        <div className="logs-card">
          <div className="card-content">
            <div className="first-line">
              <small>Total Tools Created Today</small>
              <FaLinkSlash />
            </div>

            <div className="second-line-parent">
              <div className="second-line flex items-center">
                <div className="flex items-center"><h2>{infoCardValues().linkCount}</h2></div>

                {/* {infoCardValues().linkPercentage < 0 ? (
                  <small className="decrease">
                    {" "}
                    <IoIosArrowRoundDown />
                    {infoCardValues().linkPercentage * -1}%
                  </small>
                ) : (
                  <small className="increase">
                    <IoIosArrowRoundUp />
                    {infoCardValues().linkPercentage}%
                  </small>
                )} */}
              </div>

              {/* <small className="prev">vs. previous day</small> */}
            </div>

            {/* <div className="first-line">
              <small>0%</small>
              <small>100%</small>
            </div> */}
            {/* <div
              className="progress-bar"
              style={{
                backgroundColor:
                  linksLogs?.percentageChange < 0 ? "#ffe4e4" : "#e4faff",
              }}
            >
              <div
                className="progress"
                style={{
                  width: `${logProgress(linksLogs?.percentageChange)}%`,
                  backgroundColor:
                    linksLogs?.percentageChange < 0 ? "#aa3939" : "#378ba3",
                }}
              ></div>
            </div> */}
          </div>
        </div>

        <div className="logs-card">
          <div className="card-content">
            <div className="first-line">
              <small>New Clients</small>
              <LuUsers />
            </div>

            <div className="second-line-parent">
              <div className="second-line">
                <h2>{infoCardValues().userCount}</h2>
                {/* {userLogs?.percentageChange < 0 ? (
                  <small className="decrease">
                    {" "}
                    <IoIosArrowRoundDown />
                    {userLogs?.percentageChange * -1}%{" "}
                  </small>
                ) : (
                  <small className="increase">
                    <IoIosArrowRoundUp />
                    {userLogs?.percentageChange}%
                  </small>
                )} */}
              </div>

              {/* <small className="prev">vs. previous day</small> */}
            </div>

            {/* <div className="first-line">
              <small>0%</small>
              <small>100%</small>
            </div>
            <div
              className="progress-bar"
              style={{
                backgroundColor:
                  userLogs?.percentageChange < 0 ? "#ffe4e4" : "#e4faff",
              }}
            >
              <div
                className="progress"
                style={{
                  width: `${logProgress(userLogs?.percentageChange)}%`,
                  backgroundColor:
                    userLogs?.percentageChange < 0 ? "#aa3939" : "#378ba3",
                }}
              ></div>
            </div> */}
          </div>
        </div>

        <div className="logs-card">
          <div className="card-content">
            <div className="first-line">
              <small>Total Clients</small>
              <LuUsers />
            </div>

            <div className="second-line-parent">
              <div className="second-line">
                <h2>{users?.length}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="logs-card">
          <div className="card-content">
            <div className="first-line">
              <small>Total Tools Created</small>
              <FaLinkSlash />
            </div>

            <div className="second-line-parent">
              <div className="second-line">
                <h2>{spreadSheet?.length}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
