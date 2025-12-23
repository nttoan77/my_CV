// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import httpRequest from '~/utils/httpRequest';
// import classNames from 'classnames/bind';
// import styles from './ChooseCV.module.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     faPlus,
//     faUser,
//     faEnvelope,
//     faCalendarAlt,
//     faMapMarkerAlt,
//     faVenusMars,
// } from '@fortawesome/free-solid-svg-icons';
// import Header from '~/layouts/components/header/header';
// import WrapperUser from '~/layouts/components/header/wrapperUser/wrapperUser';
// import Tippy from '@tippyjs/react';
// import HeaderChooseCV from './headerChooseCV/hearderChooseCV';

// const cx = classNames.bind(styles);

// function ChooseCV() {
//     const [cvList, setCvList] = useState([]);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showDropdown, setShowDropdown] = useState(false);

//     const dropdownRef = useRef();

//     const navigate = useNavigate();

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         localStorage.removeItem('selectedCVId');
//         setShowDropdown(false);
//         navigate('/login');
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     navigate('/login');
//                     return;
//                 }

//                 // 1. LẤY THÔNG TIN USER TỪ API MỚI (có avatar, genderDisplay, v.v.)
//                 const userRes = await httpRequest.get('api/auth/profile'); // ĐÚNG ROUTE
//                 const userData = userRes.data?.user || userRes.data;
//                 setUser(userData);

//                 // 2. LẤY DANH SÁCH CV
//                 const cvRes = await httpRequest.get('/cv');
//                 setCvList(cvRes.data?.cvs || cvRes.data || []);
//             } catch (err) {
//                 console.error('Lỗi khi tải dữ liệu:', err);
//                 if (err.response?.status === 401) {
//                     localStorage.clear();
//                     navigate('/login');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [navigate]);

//     const handleCreateNewCV = () => {
//         navigate('/regis-Information-CV');
//     };

//     const handleSelectCV = (cvId) => {
//         localStorage.setItem('selectedCVId', cvId);
//         navigate('/cv');
//     };

//     if (loading) {
//         return (
//             <div className={cx('loading-container')}>
//                 <div className={cx('spinner')}></div>
//                 <p>Đang tải thông tin...</p>
//             </div>
//         );
//     }

//     return (
//         <div className={cx('container')}>

//             <HeaderChooseCV classnames={cx('header-choose-cv')}/>
//             {/* NỘI DUNG CHÍNH */}
//             <div className={cx('main-content')}>
//                 <h1 className={cx('title')}>Hồ sơ CV của bạn</h1>

//                 {cvList.length === 0 ? (
//                     <div className={cx('empty-state')}>
//                         <div className={cx('empty-icon')}>No CVs</div>
//                         <h3>Bạn chưa có CV nào</h3>
//                         <p>Hãy tạo CV đầu tiên để bắt đầu chinh phục nhà tuyển dụng!</p>
//                         <button className={cx('create-first-cv-btn')} onClick={handleCreateNewCV}>
//                             <FontAwesomeIcon icon={faPlus} /> Tạo CV đầu tiên của bạn
//                         </button>
//                     </div>
//                 ) : (
//                     <div className={cx('cv-grid')}>
//                         {/* NÚT TẠO CV MỚI */}
//                         <div className={cx('cv-card', 'create-new')} onClick={handleCreateNewCV}>
//                             <div className={cx('plus-icon')}>
//                                 <FontAwesomeIcon icon={faPlus} />
//                             </div>
//                             <h3>Tạo CV mới</h3>
//                             <p>Bắt đầu với mẫu đẹp</p>
//                         </div>

//                         {/* DANH SÁCH CV */}
//                         {cvList.map((cv) => (
//                             <div key={cv._id} className={cx('cv-card')} onClick={() => handleSelectCV(cv._id)}>
//                                 <div className={cx('cv-preview')}>
//                                     <div className={cx('preview-placeholder')}>CV Preview</div>
//                                 </div>
//                                 <div className={cx('cv-info')}>
//                                     <h3>{cv.title || 'CV không có tiêu đề'}</h3>
//                                     <p>{cv.position || 'Chưa có vị trí ứng tuyển'}</p>
//                                     <span className={cx('updated-at')}>
//                                         Cập nhật: {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ChooseCV;

// =========================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpRequest from '~/utils/httpRequest';
import classNames from 'classnames/bind';
import styles from './ChooseCV.module.scss';
import HeaderChooseCV from './headerChooseCV/hearderChooseCV';
import CVList from './listCV/listCV';

const cx = classNames.bind(styles);

function ChooseCV() {
    const [cvList, setCvList] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const cvRes = await httpRequest.get('/api/auth/getCV');

                const cvs = cvRes.data?.data; // 👈 CHỈ LẤY data
                setCvList(Array.isArray(cvs) ? cvs : []);
            } catch (err) {
                console.error('Lỗi khi tải danh sách CV:', err);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    //   handle logic cv
    const handleCreateNewCV = () => {
        navigate('/regis-Information-CV');
    };


    const handleSelectCV = (cvId) => {
        localStorage.setItem('selectedCV', cvId);
        navigate('/cv');
    };

    if (loading) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('spinner')}></div>
                <p>Đang tải danh sách CV...</p>
            </div>
        );
    }

    return (
        <div className={cx('container')}>
            <HeaderChooseCV className={cx('header-choose-cv')} />

            <div className={cx('main-content')}>
                <h1 className={cx('title')}>Hồ sơ CV của bạn</h1>

                {/* TOÀN BỘ PHẦN DANH SÁCH + EMPTY ĐÃ ĐƯỢC TÁCH RA ĐÂY */}
                <CVList cvList={cvList} onCreateNew={handleCreateNewCV} onSelectCV={handleSelectCV} />
            </div>
        </div>
    );
}

export default ChooseCV;
