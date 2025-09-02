'use client';

import React, { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [aboutSubDropdownOpen, setAboutSubDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="https://agetechcollaborative.org/" className={styles.logo}>
          <img
            src="https://agetechcollaborative.org/wp-content/uploads/2020/07/1897503_ATC-Logo-2-Line_4C.png"
            alt="Company Logo"
            className={styles.logoImage}
          />
        </a>
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <div
            className={styles.dropdown}
            onClick={() => {
              if (menuOpen) setAboutDropdownOpen(!aboutDropdownOpen);
            }}
            onMouseEnter={() => !menuOpen && setAboutDropdownOpen(true)}
            onMouseLeave={() => !menuOpen && setAboutDropdownOpen(false)}
          >
            {menuOpen ? (
              <button className={styles.navLink} type="button">
                About AgeTech
                <span className={styles.arrowDown}></span>
              </button>
            ) : (
              <a href="https://agetechcollaborative.org/about/" className={styles.navLink} rel="noopener noreferrer">
                About AgeTech
                <span className={styles.arrowDown}></span>
              </a>
            )}
            {aboutDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.subDropdown}
                  onMouseEnter={() => setAboutSubDropdownOpen(true)}
                  onMouseLeave={() => setAboutSubDropdownOpen(false)}
                >
                  <a href="https://agetechcollaborative.org/about/" className={styles.dropdownItem} rel="noopener noreferrer">
                    About &nbsp;
                    <span className={styles.arrowRight}></span>
                  </a>
                  {aboutSubDropdownOpen && (
                    <div className={styles.subDropdownMenu}>
                      <a href="https://agetechcollaborative.org/agetech-by-the-numbers/" className={styles.dropdownItem}>
                        AgeTech by the Numbers
                      </a>
                    </div>
                  )}
                </div>
                <a href="https://agetechcollaborative.org/startups/" className={styles.dropdownItem}>
                  Startups
                </a>
                <a href="https://agetechcollaborative.org/investors/" className={styles.dropdownItem}>
                  Investors
                </a>
                <a href="https://agetechcollaborative.org/enterprise/" className={styles.dropdownItem}>
                  Enterprises
                </a>
                <a href="https://agetechcollaborative.org/testbed/" className={styles.dropdownItem}>
                  Testbeds
                </a>
                <a href="https://agetechcollaborative.org/business-service/" className={styles.dropdownItem}>
                  Business Services
                </a>
              </div>
            )}
          </div>
          <a href="https://home.agetechcollaborative.org/startup/directory" className={styles.navLink}>
            Startup Directory
          </a>
          <div className={styles.dropdown}
            onClick={() => {
              if (menuOpen) setEventsDropdownOpen(!eventsDropdownOpen);
            }}
            onMouseEnter={() => !menuOpen && setEventsDropdownOpen(true)}
            onMouseLeave={() => !menuOpen && setEventsDropdownOpen(false)}
          >
            {menuOpen ? (
              <button className={styles.navLink} type="button">
                Events
                <span className={styles.arrowDown}></span>
              </button>
            ) : (
              <a href="https://agetechcollaborative.org/events/" className={styles.navLink} rel="noopener noreferrer">
                Events
                <span className={styles.arrowDown}></span>
              </a>
            )}
            {eventsDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <a href="https://agetechcollaborative.org/events/" className={styles.dropdownItem}>
                  Pitch Events
                </a>
                <a href="https://agetechcollaborative.org/ces/" className={styles.dropdownItem}>
                  CES
                </a>
              </div>
            )}
          </div>
          <div
            className={styles.dropdown}
            onClick={() => {
              if (menuOpen) setResourcesDropdownOpen(!resourcesDropdownOpen);
            }}
            onMouseEnter={() => !menuOpen && setResourcesDropdownOpen(true)}
            onMouseLeave={() => !menuOpen && setResourcesDropdownOpen(false)}
          >
            {menuOpen ? (
              <button className={styles.navLink} type="button">
                Resources
                <span className={styles.arrowDown}></span>
              </button>
            ) : (
              <a href="#" className={styles.navLink} onClick={(e) => e.preventDefault()}>
                Resources
                <span className={styles.arrowDown}></span>
              </a>
            )}
            {resourcesDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <a href="https://agetechcollaborative.org/insights/" className={styles.dropdownItem}>
                  Insights
                </a>
                <a href="https://home.agetechcollaborative.org/startup/blog" className={styles.dropdownItem}>
                  Blog
                </a>
                <a href="https://agetechcollaborative.org/news/" className={styles.dropdownItem}>
                  News
                </a>
              </div>
            )}
          </div>
          <a href="https://home.agetechcollaborative.org/" className={styles.navLink}>
            Sign In
          </a>
          <a href="https://agetechcollaborative.org/apply-to-join/" className={styles.applyToday}>
            Apply Today
          </a>
        </nav>
      </div>
    </header>
  );
}
