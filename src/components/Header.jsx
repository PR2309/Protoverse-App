import React from 'react';

const Header = ({ toggleSidebar, theme, toggleTheme }) => {
    return (
        <header className="app-header">
            <div className="container">
                <div className="header-inner">
                    <button className="icon-btn" onClick={toggleSidebar} aria-label="Open menu">
                        &#9776;
                    </button>
                    <h3 className="header-title">Early Distress Support</h3>
                    <label className="toggle-switch" style={{ marginRight: '4px' }}>
                        <input
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                            aria-label="Toggle dark mode"
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </header>
    );
};

export default Header;
