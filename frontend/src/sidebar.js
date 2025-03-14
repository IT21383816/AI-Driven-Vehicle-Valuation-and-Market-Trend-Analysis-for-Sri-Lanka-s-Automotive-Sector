import React from "react";
import { FaChartLine, FaDatabase, FaUsers, FaFileAlt, FaTrash, FaBookmark, FaHome } from "react-icons/fa";
import { MdOutlineAnalytics, MdSearch } from "react-icons/md";
import "./sidebar.css"; // Create and style this file


const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo"> GREEN AUTO</h2>

      <div className="sidebar-search">
        <MdSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <ul className="sidebar-menu">
        <li className="active">
          <FaHome className="icon" /> Damage detection
        </li>
        <li>
          <FaChartLine className="icon" /> Market Trend
        </li>
        <li>
          <FaDatabase className="icon" /> Sustainability assessment
        </li>
        <li>
          <MdOutlineAnalytics className="icon" /> Vehicle valuation
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
