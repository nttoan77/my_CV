import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import style from './CV.module.scss';

import AboutMe from '../../pagesComponent/AboutMe/AboutMe';
import Education from '../../pagesComponent/Education/Education';
import Experience from '../../pagesComponent/Experience/Experience';
import ProfessionalSkill from '../../pagesComponent/ProfessionalSkill/ProfessionalSkill';
import ScrollToTopButton from '~/components/ScrollToTopButton/ScrollToTopButton';
import SlideEducation from '~/pages/pagesComponent/Education/slideEducation/slideEducation';

import httpRequest from '~/utils/httpRequest';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(style);

function CV({ refs = {} }) {
  const { id: urlId } = useParams();
  const navigate = useNavigate();

  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔒 CHẶN FETCH LẶP (React 18 StrictMode)
  const hasFetched = useRef(false);

  useEffect(() => {
    // console.group('🧭 [CV] useEffect START');

    // console.log('🔹 urlId:', urlId);
    let selectedCVId = localStorage.getItem('selectedCV');
    // console.log('🔹 selectedCVId (localStorage):', selectedCVId);

    // Ưu tiên ID trên URL
    if (!selectedCVId && urlId && urlId.length === 24) {
      selectedCVId = urlId;
      // console.log('➡️ Lấy CV ID từ URL:', selectedCVId);
    }

    // ❌ ID không hợp lệ
    if (!selectedCVId || selectedCVId.length !== 24) {
      // console.warn('❌ Không có CV ID hợp lệ → redirect /choose-cv');
      // console.groupEnd();
      navigate('/choose-cv');
      return;
    }

    // ⛔ React StrictMode gọi effect 2 lần (DEV)
    if (hasFetched.current) {
      // console.log('⛔ [DEV] Skip fetch CV (StrictMode)');
      // console.groupEnd();
      return;
    }

    hasFetched.current = true;
    // console.log('✅ Bắt đầu fetch CV với ID:', selectedCVId);

    const fetchCV = async () => {
      // console.time('⏱ Fetch CV time');
      try {
        const res = await httpRequest.get(`/api/cv/${selectedCVId}`);

        // console.log('📦 API response:', res);
        const data = res.data?.data || res.data;

        // console.log('✅ CV DATA nhận được:', data);
        setCvData(data);
      } catch (err) {
        // console.error('🔥 Lỗi fetch CV:', err);

        if (err.response) {
          // console.error('📛 Status:', err.response.status);
          // console.error('📛 Data:', err.response.data);
        }

        navigate('/choose-cv');
      } finally {
        setLoading(false);
        // console.timeEnd('⏱ Fetch CV time');
        // console.groupEnd();
      }
    };

    fetchCV();
  }, [urlId, navigate]);

  /* ================= RENDER DEBUG ================= */
  // console.log('🔄 Render CV component');
  // console.log('📊 loading:', loading);
  // console.log('📄 cvData:', cvData);

  if (loading) {
    return <div className={cx('loading')}>Đang tải CV...</div>;
  }

  if (!cvData) {
    return <div className={cx('loading')}>Không có dữ liệu CV</div>;
  }

  const {
    education = [],
    workExperiences = [],
    skills = [],
  } = cvData;

  // console.log('🎓 education:', education);
  // console.log('💼 workExperiences:', workExperiences);
  // console.log('🛠 skills:', skills);

  return (
    <div className={cx('wrapper')}>
      <section ref={refs.AboutMeRef} className={cx('item')}>
        <AboutMe data={cvData} />
      </section>


      <section ref={refs.EducationRef} className={cx('item')}>
        <Education data={education} />
        <SlideEducation data={cvData} />
      </section>

      <section ref={refs.ExperienceProjectsRef} className={cx('item')}>
        <Experience data={workExperiences} />
      </section>

      <section ref={refs.ProfessionalSkillRef} className={cx('item')}>
        <ProfessionalSkill data={skills} />
      </section>

      <ScrollToTopButton />
    </div>
  );
}

export default CV;
