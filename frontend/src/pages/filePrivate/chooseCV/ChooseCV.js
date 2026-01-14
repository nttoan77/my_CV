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

    // === CẢI TIẾN: Tách hàm fetch riêng để dễ reuse khi xóa CV ===
    const fetchCVs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // === SỬA: Thêm header Authorization (nếu httpRequest chưa tự xử lý)
            const cvRes = await httpRequest.get('/api/cv', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const cvs = cvRes.data?.data || cvRes.data; // ← Linh hoạt hơn, phòng trường hợp API trả về data hoặc trực tiếp array
            setCvList(Array.isArray(cvs) ? cvs : []);
        } catch (err) {
            console.error('Lỗi khi tải danh sách CV:', err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token'); // ← Chỉ clear token, không clear hết localStorage
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchCVs();
            setLoading(false);
        };
        loadData();
    }, [navigate]);

    // === THÊM MỚI: Hàm xử lý xóa CV + cập nhật lại danh sách ===
    const handleDeleteCV = async (cvId) => {
        if (!cvId) return;

        try {
            const token = localStorage.getItem('token');
            await httpRequest.delete(`/api/cv/${cvId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Cập nhật state local (cách nhanh & mượt nhất)
            setCvList((prev) => prev.filter((cv) => (cv._id || cv.cvId) !== cvId));

            // Optional: Nếu muốn chắc chắn dữ liệu mới nhất từ server
            // await fetchCVs();
        } catch (err) {
            console.error('Lỗi xóa CV:', err);
            alert('Không thể xóa CV. Vui lòng thử lại!');
            // Có thể thêm toast notification ở đây sau này
        }
    };

    const handleCreateNewCV = () => {
        navigate('/regis-Information-CV');
    };

    const handleSelectCV = (cvItem) => {
        if (!cvItem) return;

        const cvId = cvItem._id || cvItem.cvId; // ← Đảo thứ tự: ưu tiên _id (MongoDB thường dùng _id)
        if (!cvId) return;

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

                {/* === THÊM PROP onDeleteCV để truyền xuống CVList === */}
                <CVList
                    cvList={cvList}
                    onCreateNew={handleCreateNewCV}
                    onSelectCV={handleSelectCV}
                    onDeleteCV={handleDeleteCV} // <--- ĐÂY LÀ PHẦN QUAN TRỌNG ĐỂ CHỨC NĂNG XÓA HOẠT ĐỘNG
                />
            </div>
        </div>
    );
}

export default ChooseCV;
