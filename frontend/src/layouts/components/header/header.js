// src/components/Header/Header.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faSignOutAlt,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './header.module.scss';
import listHeader from './listHeader';
import WrapperUser from './wrapperUser/wrapperUser';
import useClickOutside from '~/hooks/useClickOutside';

const cx = classNames.bind(style);

function Header({ scrollToSection }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(listHeader.Introduce);
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const selectRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Lấy user từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error('Lỗi parse user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Đóng tất cả dropdown/menu khi click ra ngoài
  useClickOutside([dropdownRef, selectRef, mobileMenuRef], () => {
    setShowDropdown(false);
    setIsOpenSelect(false);
    setIsMobileMenuOpen(false);
  });

  const options = [
    { label: listHeader.Introduce, value: 'IntroduceRef' },
    { label: listHeader.AboutMe, value: 'AboutMeRef' },
    { label: listHeader.Experience_Projects, value: 'ExperienceProjectsRef' },
    { label: listHeader.Education, value: 'EducationRef' },
    { label: listHeader.ProfessionalSkill, value: 'ProfessionalSkillRef' },
  ];

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpenSelect(false);
    scrollToSection(option.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCVId');
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <header className={cx('wrapper')}>
      {/* Nút Home + Mobile Menu */}
      <div className={cx('left-section')}>
        <button
          onClick={() => navigate('/choose-cv')}
          className={cx('home-btn')}
          aria-label="Trang chủ"
        >
          <FontAwesomeIcon icon={faHome} />
        </button>

        <button
          className={cx('mobile-menu-btn')}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Mở menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Custom Select - Desktop */}
      <div className={cx('select-wrapper')} ref={selectRef}>
        <div
          className={cx('custom-select', { open: isOpenSelect })}
          onClick={(e) => {
            e.stopPropagation();                    // ← NGĂN EVENT LAN RA NGOÀI
            setIsOpenSelect(prev => !prev);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();                  // ← NGĂN KHI DÙNG PHÍM
              setIsOpenSelect(prev => !prev);
            }
          }}
        >
          <span className={cx('selected-text')}>{selected}</span>
          <span className={cx('arrow')} />
        </div>

        {isOpenSelect && (
          <div className={cx('options')}>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cx('option', { active: selected === opt.label })}
                onClick={(e) => {
                  e.stopPropagation(); // Không bắt buộc nhưng an toàn hơn
                  handleSelect(opt);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    handleSelect(opt);
                  }
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={cx('mobile-menu')} ref={mobileMenuRef}>
          <div className={cx('mobile-options')}>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cx('mobile-option', { active: selected === opt.label })}
                onClick={() => {
                  handleSelect(opt);
                  setIsMobileMenuOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;