import classNames from 'classnames/bind';
import style from './UserHeader.module.scss';
import { useState } from 'react';
import UserModal from '../UserModal/UserModal';
import SearchBar from '../SearchBar/SearchBar';

const cx = classNames.bind(style);

function UserHeader({ onSearch, onAddUser ,onUserAdded  }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Mở modal để thêm user
    const handleAdd = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // ✅ Khi thêm user thành công, gọi callback từ Admin
    const handleUserAdded = () => {
        if (onUserAdded) onUserAdded(); // gọi callback reload trong Admin
        setShowModal(false); // đóng modal
      };

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <h1>Quản lý người dùng</h1>
                <div className={cx('search')}>
                    <SearchBar onSearch={onSearch} />
                </div>
                <button className={cx('add-btn')} onClick={handleAdd}>
                    + Thêm người dùng
                </button>
            </header>

            {/* Modal thêm/chỉnh sửa người dùng */}
            {showModal && (
                <UserModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onSuccess={handleUserAdded}
                />
            )}
        </div>
    );
}

export default UserHeader;
