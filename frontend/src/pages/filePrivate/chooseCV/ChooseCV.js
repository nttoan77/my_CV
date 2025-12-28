

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


    const handleSelectCV = (cvItem) => {
        if (!cvItem) return;
      
        const cvId = cvItem.cvId || cvItem._id;  // ← Lấy cvId trước, fallback _id
      
        localStorage.setItem('selectedCV', cvId);
        navigate(`/cv/${cvId}`);
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
