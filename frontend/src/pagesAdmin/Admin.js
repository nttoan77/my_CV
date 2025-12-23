import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import UserTable from './components/UserTable/UserTable';
import UserModal from './components/UserModal/UserModal';
import UserHeader from './components/UserHeader/UserHeader';
import DeletedUserTable from './components/DeletedUserTable/DeletedUserTable';
import axios from 'axios';

const cx = classNames.bind(styles);

const Admin = () => {
  // 🟩 Sửa API_URL để có giá trị dự phòng
  const API_URL =
    process.env.REACT_APP_BASE_URL
      ? `${process.env.REACT_APP_BASE_URL}/api/auth/Admin`
      : 'http://localhost:8888/api/auth/Admin';

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [deletedUsers, setDeletedUsers] = useState([]);
  const [viewDeleted, setViewDeleted] = useState(false);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredUsers(users);
    } else {
      const lower = query.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.nameUser?.toLowerCase().includes(lower) ||
          user.email?.toLowerCase().includes(lower) ||
          user.phone?.toLowerCase().includes(lower),
      );
      setFilteredUsers(filtered);
    }
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  // 🟩 Sửa toàn bộ logic fetchUsers()
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const currentUser = JSON.parse(localStorage.getItem('user'));

      if (!token) {
        console.error('❌ Không tìm thấy token, cần đăng nhập lại.');
        return;
      }

      const res = await fetch(`${API_URL}?includeDeleted=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Không thể lấy danh sách người dùng');
      const result = await res.json();

      // 🟩 API có thể trả về { users: [...] } hoặc mảng trực tiếp
      const data = Array.isArray(result) ? result : result.users || [];

      // 🟩 Lấy ID người hiện tại (có thể là _id hoặc userId)
      const currentUserId = currentUser?._id || currentUser?.userId;
      console.log('👤 ID người đăng nhập:', currentUserId);

      // 🟩 Loại bỏ người đang đăng nhập khỏi danh sách
      const filtered = data.filter(
        (u) => u._id !== currentUserId && u.userId !== currentUserId
      );

      // 🟩 Tách người dùng hoạt động và đã xóa
      setUsers(filtered.filter((u) => !u.isDeleted));
      setDeletedUsers(filtered.filter((u) => u.isDeleted));

      console.log('✅ Dữ liệu người dùng sau khi lọc:', filtered);
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách người dùng:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    console.log('🟢 Gọi fetchUsers() khi load trang');
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể xóa người dùng');
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`${API_URL}/restore/${id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Không thể khôi phục người dùng');
      await res.json();
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi khôi phục người dùng:', error);
    }
  };

  const handleDeletePermanent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/permanent/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể xóa vĩnh viễn người dùng');
      await res.json();
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi xóa vĩnh viễn người dùng:', error);
    }
  };

  // 🟩 Phân quyền admin / gỡ quyền
  const handleChangeRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Bạn cần đăng nhập lại để thực hiện thao tác này!');
        return;
      }

      await axios.put(
        `${API_URL}/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 🟩 Cập nhật ngay trên giao diện
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error('❌ Lỗi khi thay đổi quyền:', error);
      alert('Không thể thay đổi quyền, vui lòng kiểm tra token hoặc API.');
    }
  };

  return (
    <div className={cx('admin-container')}>
      <Sidebar />
      <div className={cx('admin-content')}>
        <UserHeader onUserAdded={handleUserAdded} onSearch={handleSearch} onAddUser={handleAdd} />

        <div className={cx('tab-buttons')}>
          <button
            className={cx('btn-list', { active: !viewDeleted })}
            onClick={() => setViewDeleted(false)}
          >
            Người dùng hoạt động
          </button>
          <button
            className={cx('btn-list', { active: viewDeleted })}
            onClick={() => setViewDeleted(true)}
          >
            Người dùng đã xóa
          </button>
        </div>

        {!viewDeleted ? (
          <UserTable
            className={cx('user-table')}
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangeRole={handleChangeRole}
          />
        ) : (
          <DeletedUserTable
            users={deletedUsers}
            onRestore={handleRestore}
            onDeletePermanent={handleDeletePermanent}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
