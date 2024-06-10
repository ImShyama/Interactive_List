import React from "react";

const Header = () => {
  return (
    <div>
      <div className="header_main">
        <div className="left-panel-parent">
          <div className="left-panel">
            <div className="left-panel-inner">
              <svg
                width="31"
                height="33"
                viewBox="0 0 31 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Group 34">
                  <rect
                    id="Rectangle 25"
                    y="1.13965"
                    width="8"
                    height="27"
                    rx="4"
                    fill="#FFA500"
                  />
                  <path
                    id="Vector 36"
                    d="M16 4.63965V23.1396C16.3333 24.8063 17.7 28.2396 20.5 28.6396C23.3 29.0396 26 28.8063 27 28.6396"
                    stroke="#FFA500"
                    stroke-width="8"
                    stroke-linecap="round"
                  />
                  <circle
                    id="Ellipse 10"
                    cx="25"
                    cy="14.1396"
                    r="4"
                    fill="#111111"
                  />
                </g>
              </svg>
            </div>
            <div className="interact-parent">
              <div className="interact">Interact</div>
              <div className="interactive-table">Interactive Table</div>
            </div>
          </div>
          <div className="right-panel">
            <div className="iocons-set">
              <div className="iocons-set-inner">
                <div className="frame-wrapper">
                  <div className="frame-container">
                    <img className="frame-icon" alt="" src="/frame.svg" />
                  </div>
                </div>
              </div>
            </div>
            <img className="divider-icon" alt="" src="/divider.svg" />
            <div className="right-panel-inner">
              <div className="image-25-wrapper">
                <img className="image-25-icon" alt="" src="/image-25@2x.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
