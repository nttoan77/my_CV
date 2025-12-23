// import { Link, useNavigate } from 'react-router-dom';
// import React, { useEffect, useRef, useState } from 'react';
// import Tippy from '@tippyjs/react/headless';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome } from '@fortawesome/free-solid-svg-icons';

// //
// import classNames from 'classnames/bind';
// import style from './header.module.scss';
// import listHeader from './listHeader';
// import listUser from '../../../components/List/list';
// import WrapperUser from './wrapperUser/wrapperUser';
// import useClickOutside from '~/hooks/useClickOutside';

// const cx = classNames.bind(style);

// function Header({ scrollToSection }) {
//     const popupRef = useRef();
//     const wrapperRef = useRef();
//     const selectRef = useRef();
//     const buttonRef = useRef();
//     const [dataUser, setDataUser] = useState(null);
//     const Navigate = useNavigate();
//     const [isOpen, setIsOpen] = useState(false);
//     const [selected, setSelected] = useState(listHeader.Introduce);

//     const [showPopup, setShowPopup] = useState(false);

//     const options = [
//         { label: listHeader.Introduce, value: 'IntroduceRef' },
//         { label: listHeader.AboutMe, value: 'AboutMeRef' },
//         { label: listHeader.Experience_Projects, value: 'ExperienceProjectsRef' },
//         { label: listHeader.Education, value: 'EducationRef' },
//         { label: listHeader.ProfessionalSkill, value: 'ProfessionalSkillRef' },
//     ];

//     const handleSelect = (option) => {
//         setSelected(option.label);
//         setIsOpen(false);
//         handleChange({ target: { value: option.value } });
//     };

//     const handleClosePopup = () => {
//         setShowPopup(false);
//     };

//     const handleChange = (e) => {
//         const value = e.target.value;
//         if (value) {
//             scrollToSection(value);
//         }
//     };

//     useClickOutside([popupRef, buttonRef], () => setShowPopup(false));

//     // ✅ dùng useClickOutside cho select custom
//     useClickOutside([selectRef], () => setIsOpen(false));
//     useClickOutside([wrapperRef], () => setIsOpen(false));

//     // useEffect(() => {
//     //     const handleClickOutside = (e) => {
//     //         if (
//     //             popupRef.current &&
//     //             !popupRef.current.contains(e.target) &&
//     //             buttonRef.current &&
//     //             !buttonRef.current.contains(e.target)
//     //         ) {
//     //             setShowPopup(false);
//     //         }
//     //     };
//     //     document.addEventListener('mousedown', handleClickOutside);
//     //     return () => {
//     //         document.removeEventListener('mousedown', handleClickOutside);
//     //     };
//     // }, []);

//     // get api
//     useEffect(() => {
//         const token = localStorage.getItem('token');

//         // Nếu không có token → không gọi API, hiển thị mặc định "Khách"
//         if (!token) {
//             setDataUser(null);
//             return;
//         }

//         const fetchUser = async () => {
//             try {
//                 const res = await fetch('http://localhost:8888/api/auth/profile', {
//                     method: 'GET',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 if (!res.ok) {
//                     throw new Error(`Lỗi ${res.status}`);
//                 }

//                 const data = await res.json();
//                 setDataUser(data.user || data); // tùy cấu trúc response của bạn
//                 // Cập nhật lại localStorage nếu cần
//                 localStorage.setItem('user', JSON.stringify(data.user || data));
//             } catch (error) {
//                 console.error('Lỗi lấy thông tin user:', error);
//                 // Token hết hạn hoặc lỗi → xóa đi
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 localStorage.removeItem('userId');
//                 setDataUser(null);
//                 // Navigate('/login'); // nếu muốn tự động về login
//             }
//         };

//         fetchUser();
//     }, []);

//     if (dataUser === null && localStorage.getItem('token')) {
//         return <div className={cx('logo')}>Đang tải...</div>;
//     }

//     if (!dataUser) {
//         return (
//             <header className={cx('wrapper')}>
//                 <nav className={cx('nav')}>
//                     <button onClick={() => Navigate('/')}>
//                         <FontAwesomeIcon className={cx('content-icon')} icon={faHome} />
//                     </button>
//                 </nav>
//                 <div className={cx('logo')} onClick={() => Navigate('/login')}>
//                     <span className={cx('initials')}>Khách</span>
//                 </div>
//             </header>
//         );
//     }

//     return (
//         <header className={cx('wrapper')}>
//             <nav className={cx('nav')}>
//                 <button onClick={() => Navigate('/')}>
//                     <FontAwesomeIcon className={cx('content-icon')} icon={faHome} />
//                 </button>
//                 <section className={cx('content-selection')} ref={selectRef}>
//                     <div className={cx('custom-select', { open: isOpen })} onClick={() => setIsOpen(!isOpen)}>
//                         <div className={cx('selected-value')}>{selected}</div>
//                         <div className={cx('arrow')}></div>
//                         {isOpen && (
//                             <div className={cx('options')}>
//                                 {options.map((option) => (
//                                     <div
//                                         key={option.value}
//                                         className={cx('option', { active: selected === option.label })}
//                                         onClick={() => handleSelect(option)}
//                                     >
//                                         {option.label}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </section>
//             </nav>
//             <Tippy
//                 interactive
//                 visible={showPopup}
//                 placement="bottom-end"
//                 animation={false}
//                 offset={[50, 5]}
//                 render={(attrs) => (
//                     <div
//                         className={cx('popper-wrapper')}
//                         ref={(el) => (popupRef.current = el)}
//                         tabIndex="-1"
//                         {...attrs}
//                     >
//                         <WrapperUser ref={wrapperRef} />
//                     </div>
//                 )}
//             >
//                 <div className={cx('logo')} onClick={() => setShowPopup((prev) => !prev)} ref={buttonRef}>
//                     <span className={cx('initials')}>{dataUser?.nameUser || 'Khách'}</span>
//                 </div>
//             </Tippy>
//         </header>
//     );
// }

// export default Header;


// =====================================================================

// src/components/Header/Header.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt, faUserCog, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
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

  const dropdownRef = useRef();
  const selectRef = useRef();

  // Lấy user từ localStorage + API
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Lỗi parse user:", err);
      }
    }
  }, []);

  // Đóng dropdown khi click ngoài
  useClickOutside([dropdownRef], () => setShowDropdown(false));
  useClickOutside([selectRef], () => setIsOpenSelect(false));

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
      {/* NÚT HOME */}
      <button onClick={() => navigate('/')} className={cx('home-btn')}>
        <FontAwesomeIcon icon={faHome} />
      </button>

      {/* SELECT MỤC LỤC */}
      <div className={cx('select-wrapper')} ref={selectRef}>
        <div
          className={cx('custom-select', { open: isOpenSelect })}
          onClick={() => setIsOpenSelect(!isOpenSelect)}
        >
          <span className={cx('selected-text')}>{selected}</span>
          <span className={cx('arrow')}></span>
        </div>

        {isOpenSelect && (
          <div className={cx('options')}>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cx('option', { active: selected === opt.label })}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* USER DROPDOWN – SIÊU ĐẸP */}
      <div className={cx('user-section')}>
        {user ? (
          <Tippy
            interactive
            visible={showDropdown}
            placement="bottom-end"
            offset={[0, 8]}
            render={() => (
              <div className={cx('dropdown')} ref={dropdownRef}>
                <WrapperUser user={user} onLogout={handleLogout} />
              </div>
            )}
          >
            <div
              className={cx('user-avatar')}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className={cx('avatar-img')} />
              ) : (
                <div className={cx('avatar-placeholder')}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              <div className={cx('user-info')}>
                <span className={cx('user-name')}>{user.name || 'Người dùng'}</span>
                <span className={cx('user-email')}>{user.email}</span>
              </div>
            </div>
          </Tippy>
        ) : (
          <button onClick={() => navigate('/login')} className={cx('login-btn')}>
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;