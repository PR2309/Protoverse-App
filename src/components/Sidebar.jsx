import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineRobot } from "react-icons/ai";
import { MdPrivacyTip, MdFitnessCenter } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";

const Sidebar = ({ isOpen, closeSidebar, theme, toggleTheme }) => {
    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Menu</h2>
                    <button className="close-btn" onClick={closeSidebar} aria-label="Close menu">&times;</button>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        {/* <span className="sidebar-icon">&#9679;</span> */}
                        <span className="sidebar-icon"><AiOutlineHome /></span>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        {/* <span className="sidebar-icon">&#9998;</span> */}
                        <span className="sidebar-icon"><AiOutlineRobot /></span>
                        <span>AI Support Chat</span>
                    </NavLink>
                    <NavLink to="/exercises" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        {/* <span className="sidebar-icon">&#9673;</span> */}
                        <span className="sidebar-icon"><MdFitnessCenter /></span>
                        <span>Exercises</span>
                    </NavLink>
                    <NavLink to="/community" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        {/* <span className="sidebar-icon">&#9733;</span> */}
                        <span className="sidebar-icon"><HiOutlineUsers /></span>
                        <span>Community</span>
                    </NavLink>
                    <NavLink to="/emergency" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="sidebar-icon">&#9888;</span>
                        <span>Emergency</span>
                    </NavLink>

                    <div className="sidebar-divider"></div>

                    <NavLink to="/about" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="sidebar-icon">&#9432;</span>
                        <span>About</span>
                    </NavLink>
                    <NavLink to="/services" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="sidebar-icon">&#9881;</span>
                        <span>Services</span>
                    </NavLink>
                    <NavLink to="/privacy" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        {/* <span className="sidebar-icon">&#9670;</span> */}
                        <span className="sidebar-icon"><MdPrivacyTip /></span>
                        <span>Privacy</span>
                    </NavLink>
                    <NavLink to="/contact" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="sidebar-icon">&#9993;</span>
                        <span>Contact</span>
                    </NavLink>

                    <div className="sidebar-divider"></div>

                    <div className="theme-toggle-row">
                        <span className="theme-toggle-label">
                            <span className="sidebar-icon">&#9788;</span>
                            Dark Mode
                        </span>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} aria-label="Toggle dark mode" />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </nav>
            </aside>
            <style>{`
                /* Kill underline in ALL states */
                .sidebar-nav{
                 padding-left:20px;
                }

                .sidebar-link,
                .sidebar-link:hover,
                .sidebar-link:focus,
                .sidebar-link:focus-visible,
                .sidebar-link:active {
                    text-decoration: none !important;
                }

                /* Base link styling */
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 14px;
                    border-radius: 8px;
                    color: inherit;
                    transition: background-color 0.25s ease, transform 0.2s ease;
                }

                /* Hover effect */
                .sidebar-link:hover {
                    background-color: rgba(0, 0, 0, 0.06);
                    transform: translateX(4px);
                }

                /* Active route */
                .sidebar-link.active {
                    background-color: rgba(0, 0, 0, 0.12);
                    font-weight: 600;
                }

                /* Icon micro-interaction */
                .sidebar-icon {
                    transition: transform 0.2s ease;
                }

                .sidebar-link:hover .sidebar-icon {
                    transform: scale(1.1);
                }

                /* Divider */
                .sidebar-divider {
                height: 1px;
                margin: 12px 0;
                background-color: rgba(0, 0, 0, 0.1);
                }

                /* Dark mode */
                body.dark .sidebar-link:hover {
                    background-color: rgba(255, 255, 255, 0.08);
                }

                body.dark .sidebar-link.active {
                    background-color: rgba(255, 255, 255, 0.14);
                }

                body.dark .sidebar-divider {
                    background-color: rgba(255, 255, 255, 0.15);
                }
            `}</style>

        </>
    );
};

export default Sidebar;
