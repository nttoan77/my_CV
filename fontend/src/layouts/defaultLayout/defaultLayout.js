import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '../../layouts/components/header/header';
// import Sidebar from '~/layouts/components/Sidebar';
import styles from './defaultLayout.module.scss';
import { useRef } from 'react';
import Home from '~/pages/filePrivate/CV/CV';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const sectionRefs = {
        IntroduceRef: useRef(null),
        AboutMeRef: useRef(null),
        ExperienceProjectsRef: useRef(null),
        EducationRef: useRef(null),
        ProfessionalSkillRef: useRef(null),
    };

    const scrollToSection = (key) => {
        if (sectionRefs[key]?.current) {
            sectionRefs[key].current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                {' '}
                <Header scrollToSection={scrollToSection} />{' '}
            </div>
            <div className={cx('container')}>
                <Home refs={sectionRefs} />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}
export default DefaultLayout;
