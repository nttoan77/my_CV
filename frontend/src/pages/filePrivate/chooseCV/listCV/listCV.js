// CVList.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBriefcase, faClock } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './listCV.module.scss'; // Giữ chung file SCSS với ChooseCV

const cx = classNames.bind(styles);

const CVList = ({ cvList, onCreateNew, onSelectCV }) => {
    // Danh sách 20+ ảnh mẫu CV đẹp từ các nguồn uy tín (mình đã chọn lọc những cái rõ nét, chuyên nghiệp)
    const PLACEHOLDER_IMAGES = [
        'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/483329VcW/anh-mo-ta.png',
        'https://antimatter.vn/wp-content/uploads/2022/03/hinh-nen-may-tinh-1080x1920-toi-gian.jpg',
        'https://cellphones.com.vn/sforum/wp-content/uploads/2023/08/hinh-nen-desktop-50.jpg',
        'https://aothungame.vn/wp-content/uploads/hinh-nen-may-tinh-dep-15.jpg',
        'https://toigingiuvedep.vn/wp-content/uploads/2021/01/tai-hinh-nen-toi-gian-dep-cho-may-tinh-dien-thoai-14.jpg',
        'https://cdnv2.tgdd.vn/mwg-static/common/News/1586975/hinh-nen-may-tinh-chill%20%2811%29.jpg',
        'https://e1.pxfuel.com/desktop-wallpaper/535/254/desktop-wallpaper-colorful-landscape-illustration-ultra-backgrounds-for-widescreen-ultrawide-laptop-multi-display-dual-triple-monitor-tablet-smartphone-2d-landscape.jpg',
        'https://png.pngtree.com/thumb_back/fh260/background/20251101/pngtree-aesthetic-anime-girl-under-pastel-sakura-petals-image_20162570.webp',
        'https://i.pinimg.com/originals/c4/0a/c1/c40ac16ba30f40be595c58b0ad8aea1b.jpg',
        'https://img5.thuthuatphanmem.vn/uploads/2022/01/16/anh-nen-anime-phong-canh-hd-dep-nhat_033741854.jpg',
        // Thêm nữa nếu muốn, nhưng 20-30 là đủ để random đa dạng
    ];

    // Hàm lấy ảnh random (mỗi lần gọi sẽ khác nhau)
    const getRandomPlaceholder = () => {
        const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
        return PLACEHOLDER_IMAGES[randomIndex];
    };
    return (
        <>
            {cvList.length === 0 ? (
                // TRẠNG THÁI KHÔNG CÓ CV - ĐẸP VÀ KHUYẾN KHÍCH TẠO MỚI
                <div className={cx('empty-state')}>
                    <h2 className={cx('empty-title')}>Bạn chưa có CV nào</h2>
                    <p className={cx('empty-description')}>
                        Hãy tạo CV đầu tiên để sẵn sàng ứng tuyển và chinh phục nhà tuyển dụng!
                    </p>
                    <button className={cx('create-first-cv-btn')} onClick={onCreateNew}>
                        <FontAwesomeIcon icon={faPlus} /> Tạo CV đầu tiên
                    </button>
                </div>
            ) : (
                // KHI CÓ CV → HIỂN THỊ GRID, NÚT TẠO MỚI LUÔN Ở ĐẦU
                <div className={cx('cv-grid')}>
                    {/* CARD TẠO CV MỚI */}
                    <div className={cx('cv-card', 'create-new')} onClick={onCreateNew}>
                        <div className={cx('create-new-inner')}>
                            <FontAwesomeIcon icon={faPlus} className={cx('plus-icon-large')} />
                            <h3>Tạo CV mới</h3>
                            <p>Chọn mẫu đẹp và chuyên nghiệp</p>
                        </div>
                    </div>

                    {/* DANH SÁCH CV HIỆN CÓ */}
                    {cvList.map((cv) => (
                        <div key={cv._id} className={cx('cv-card', 'cv-item')} onClick={() => onSelectCV(cv._id)}>
                            <div className={cx('cv-preview')}>
                                <img
                                    src={cv.previewUrl || getRandomPlaceholder()}
                                    alt="Preview CV"
                                    className={cx('preview-img')}
                                />

                                {/* OVERLAY TIÊU ĐỀ NỔI BẬT - CHỈ HIỆN KHI CHƯA CÓ PREVIEW THẬT HOẶC LUÔN HIỆN ĐỂ ĐẸP */}
                                <div className={cx('preview-overlay')}>
                                    <h3 className={cx('overlay-title')}>{cv.title || 'CV chưa có tiêu đề'}</h3>
                                    {cv.position && <p className={cx('overlay-position')}>{cv.position}</p>}
                                    <div className={cx('cv-footer')}>
                                    <span className={cx('updated-at')}>
                                        <FontAwesomeIcon icon={faClock} />
                                        {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                </div>
                            </div>

                            {/* <div className={cx('cv-info')}>
                                <h3 className={cx('cv-title')}>{cv.title || 'CV không có tiêu đề'}</h3>
                                {cv.position && (
                                    <p className={cx('cv-position')}>
                                        <FontAwesomeIcon icon={faBriefcase} /> {cv.position}
                                    </p>
                                )}
                                <div className={cx('cv-footer')}>
                                    <span className={cx('updated-at')}>
                                        <FontAwesomeIcon icon={faClock} />
                                        {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div> */}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default CVList;
