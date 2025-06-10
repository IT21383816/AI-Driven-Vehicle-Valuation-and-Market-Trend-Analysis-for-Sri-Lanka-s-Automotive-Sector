import React from "react";
import { FaChartLine, FaDatabase, FaUsers, FaFileAlt, FaTrash, FaBookmark, FaHome } from "react-icons/fa";
import { MdOutlineAnalytics, MdSearch } from "react-icons/md";
import "./sidebar.css"; // Create and style this file
import { useHistory } from 'react-router-dom';


const Sidebar = () => {
  const history = useHistory();
  const handleClick = (value) => {
    history.push('/'+value);
  };
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo"> GREEN AUTO</h2>

      <div className="sidebar-search">
        <MdSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <ul className="sidebar-menu">
        <li onClick={()=>handleClick('')}>
          <FaHome className="icon" /> Damage detection
        </li>
        <li onClick={()=>handleClick('price')}>
          <FaChartLine className="icon" /> Market Trend
        </li>
        <li onClick={()=>handleClick('eco')}>
          <FaDatabase className="icon" /> Sustainability assessment
        </li>
        <li onClick={()=>handleClick('v_price')}>
          <MdOutlineAnalytics className="icon" /> Vehicle Price valuation
        </li>
        <li onClick={()=>handleClick('valuation')}>
          <MdOutlineAnalytics className="icon" /> Vehicle valuation
        </li>
        <li onClick={()=>handleClick('feedback')}>
          <MdOutlineAnalytics className="icon" /> Feedback
        </li>
        <li>
          <FaUsers className="icon" /> Team
        </li>
        <li>
          <FaBookmark className="icon" /> Saved
        </li>
        <li>
          <FaFileAlt className="icon" /> Draft
        </li>
        <li>
          <FaTrash className="icon" /> Trash
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
