import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import avatars from '~/assets/images/img-error.jpg'

const cx = classNames.bind(styles);

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
    // console.log("🟢 Dữ liệu user trong localStorage:", parsed);
    setCurrentUser(parsed);
    }
  }, []);

  return (
    <aside className={cx('sidebar')}>
      <div className={cx('header')}>
        <div className={cx('avatar')}>
          <img src={currentUser?.avatar || avatars} className={cx('logo-avatar')} />
        </div>
        <h2 className={cx('name-user')}>
          {currentUser?.name || 'Admin'}
        </h2>
      </div>
      <nav className={cx('main')}>
        <ul className={cx('content-ul')}>
          <li className={cx('content-li')}>Người dùng</li>
          <li className={cx('content-li')}>Thống kê</li>
          <li className={cx('content-li')}>Cài đặt</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
