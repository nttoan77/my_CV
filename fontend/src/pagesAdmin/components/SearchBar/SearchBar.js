import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Gọi callback truyền từ Admin.js
  };

  return (
    <div className={cx('search-container')}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Tìm kiếm người dùng..."
        className={cx('search-input')}
      />
      <FontAwesomeIcon icon={faSearch} className={cx('icon')} />
    </div>
  );
};

export default SearchBar;
