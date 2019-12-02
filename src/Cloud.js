import React from "react";
import logo from "./cloud.svg";
import "./Cloud.css";

const Cloud = () => {
  return (
    <div className='cloudbg'>
      <div className='background-wrap'>
        <div className='x1'>
          <div className='cloud'></div>
        </div>

        <div className='x2'>
          <div className='cloud'></div>
        </div>

        <div className='x3'>
          <div className='cloud'></div>
        </div>

        <div className='x4'>
          <div className='cloud'></div>
        </div>

        <div className='x5'>
          <div className='cloud'></div>
        </div>
      </div>
    </div>
  );
};

export default Cloud;
