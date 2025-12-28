import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './CV.module.scss';

import Introduce from '../../pagesComponent/Introduce/Introduce';
import AboutMe from '../../pagesComponent/AboutMe/AboutMe';
import Education from '../../pagesComponent/Education/Education';
import Experience from '../../pagesComponent/Experience/Experience';
import ProfessionalSkill from '../../pagesComponent/ProfessionalSkill/ProfessionalSkill';
import ScrollToTopButton from '~/components/ScrollToTopButton/ScrollToTopButton';

import httpRequest from '~/utils/httpRequest';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(style);

function CV({ refs = {} }) {
  const { id: urlId } = useParams(); // ID từ URL (ví dụ: /cv/123...)
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ưu tiên lấy ID đã lưu trong localStorage (từ ChooseCV)
    let selectedCVId = localStorage.getItem('selectedCV');

    // Nếu không có trong localStorage → dùng ID từ URL
    if (!selectedCVId && urlId && urlId.length === 24) {
      selectedCVId = urlId;
    }

    // Nếu vẫn không có ID hợp lệ → redirect về chọn CV
    if (!selectedCVId || selectedCVId.length !== 24) {
      console.warn('❌ Không có CV ID hợp lệ:', selectedCVId, 'URL ID:', urlId);
      navigate('/choose-cv');
      return;
    }

    console.log('✅ Đang fetch CV với ID:', selectedCVId);

    const fetchCV = async () => {
      try {
        const res = await httpRequest.get(`/api/cv/${selectedCVId}`);
        setCvData(res.data?.data);
      } catch (err) {
        console.error('Lỗi khi fetch CV:', err.response?.status, err.message);

        if (err.response?.status === 404) {
          console.warn('⚠️ CV không tồn tại hoặc không có quyền');
        }
        // Không thử fallback nữa vì giờ ID đã đồng nhất
        navigate('/choose-cv');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [urlId, navigate]); // Theo dõi urlId để reload khi đổi route

  if (loading) {
    return (
      <div className={cx('loading')}>
        <p>Đang tải hồ sơ CV...</p>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className={cx('loading')}>
        <p>Không tìm thấy dữ liệu CV</p>
      </div>
    );
  }

  const { nameCV, jobPosition, about, education, workExperiences, skills } = cvData;

  return (
    <div className={cx('wrapper')}>
      <section ref={refs.IntroduceRef} className={cx('item')}>
        <Introduce data={{ nameCV, jobPosition }} />
      </section>

      <section ref={refs.AboutMeRef} className={cx('item')}>
        <AboutMe data={about} />
      </section>

      <section ref={refs.EducationRef} className={cx('item')}>
        <Education data={education} />
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