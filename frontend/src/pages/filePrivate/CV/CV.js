import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './CV.module.scss';
import Introduce from '../../pagesComponent/Introduce/Introduce';
import AboutMe from '../../pagesComponent/AboutMe/AboutMe';
import Education from '../../pagesComponent/Education/Education';
import Experience from '../../pagesComponent/Experience/Experience';
import ProfessionalSkill from '../../pagesComponent/ProfessionalSkill/ProfessionalSkill';
import ScrollToTopButton from '~/components/ScrollToTopButton/ScrollToTopButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);

function CV({ refs }) {
    const [cvData, setCvData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const selectedCV = localStorage.getItem('selectedCVId');
    
        // ⛔ CHẶN TUYỆT ĐỐI ID SAI
        if (
            !token ||
            !selectedCV ||
            selectedCV === 'null' ||
            selectedCV === 'undefined' ||
            selectedCV.length !== 24
        ) {
            console.warn('selectedCV KHÔNG HỢP LỆ:', selectedCV);
            navigate('/choose-cv');
            return;
        }
    
        console.log('✅ Gọi CV ID:', selectedCV);
    
        const fetchCV = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8888/api/cv/${selectedCV}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                setCvData(res.data.data);
            } catch (err) {
                console.error('Lỗi tải CV:', err);
                navigate('/choose-cv');
            }
        };
    
        fetchCV();
    }, [navigate]);
    
    if (!refs || !cvData) {
        return (
            <div className={cx('loading')}>
                <p>Đang tải hồ sơ CV...</p>
            </div>
        );
    }

    const { introduce, about, education, experience, skills } = cvData;

    return (
        <div className={cx('wrapper')}>
            <section ref={refs.IntroduceRef} className={cx('item')}>
                <Introduce data={introduce} />
            </section>

            <section ref={refs.AboutMeRef} className={cx('item')}>
                <AboutMe data={about} />
            </section>

            <section ref={refs.ExperienceProjectsRef} className={cx('item')}>
                <Education data={education} />
            </section>

            <section ref={refs.EducationRef} className={cx('item')}>
                <Experience data={experience} />
            </section>

            <section ref={refs.ProfessionalSkillRef} className={cx('item')}>
                <ProfessionalSkill data={skills} />
            </section>

            <ScrollToTopButton />
        </div>
    );
}

export default CV;
