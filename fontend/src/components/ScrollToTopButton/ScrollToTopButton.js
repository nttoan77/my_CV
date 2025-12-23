import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Style from './ScrollToTopButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);
const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowButton(scrollY > 100); // Hiện nút khi cuộn hơn 100px
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    return (
        showButton && (
            <button onClick={scrollToTop} className={cx('button')} title="Trở về đầu trang">
                <FontAwesomeIcon icon={faCircleUp} />
            </button>
        )
    );
};
export default ScrollToTopButton;
