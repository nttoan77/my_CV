import classNames from 'classnames/bind';
import style from './regisInformationCV.module.scss';
import { useEffect, useState } from 'react';
import httpRequest from '~/utils/httpRequest';
import RegisSkills from './regisSkillForm/regisSkillForm';
import RegisWorkExperience from './regisWorkExperience/regisWorkExperience';
import RegisEducation from './regisEducation/regisEducation';
import RegisCertificates from './regisCertificates/regisCertificates';
import ToggleButton from '~/components/toggleShow/toggleShow';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);

const regisAddInformation = {
    nameCV:'Tên CV mà bạn muốn tạo',
    nameUser: 'Họ và tên (chính chủ): ',
    workPosition: 'Vị trí làm việc: ',
    birdDay: 'Ngày tháng năm sinh:',
    gender: 'Giới tính: ',
    website: 'Wed cá nhận: ',
    address: 'Địa chỉ nơi ở: ',
    desireInWork: 'Mong muốn đối với ',
    careerGoals: 'Mục tiêu công việc: ',
};

function AddInformation() {
    // hook
    const navigate = useNavigate();
    // action show
    const [showWorkExperience, setShowWorkExperience] = useState(false);
    const [showAddEducation, setShowAddEducation] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showCertificates, setShowCertificates] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    // personal inform
    const [nameUser, setNameUser] = useState('');
    const [avatar, setAvatar] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [careerField, setCareerField] = useState('');
    const [about, setAbout] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const [workPosition, setWorkPosition] = useState('');
    const [website, setWebsite] = useState('');
    const [nameCV, setNameCV] = useState('');
    const [error, setError] = useState('');
    const [careerGoal, setCareerGoal] = useState('');

    // level inform

    const [addWorkExperience, setAddWorkExperience] = useState([]);
    const [addSkillFrom, setAddSkillFrom] = useState([]);
    const [addEducation, setAddEducation] = useState([]);
    const [addCertificates, setAddCertificates] = useState([]);

    // handleSubmit

    const handleAddWorkExperience = (exp) => {
        setAddWorkExperience(exp);
    };
    const handleAddEducation = (exp) => {
        setAddEducation(exp);
    };

    const handleAddSkillFrom = (exp) => {
        setAddSkillFrom(exp);
    };

    const handleAddCertificates = (exp) => {
        setAddCertificates(exp);
    };

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    // get API

    // get API - ĐÃ SỬA HOÀN TOÀN ĐỂ KHỚP VỚI BACKEND CV
    const handleRegister = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Bạn chưa đăng nhập!');
            return;
        }

        try {
            const formData = new FormData();

            // === BẮT BUỘC PHẢI CÓ TIÊU ĐỀ CV ===
            const cvTitle = nameCV
                ? `CV ${nameCV} - ${new Date().getFullYear()}`
                : `CV của tôi - ${new Date().toLocaleDateString('vi-VN')}`;

            formData.append('title', cvTitle);
            formData.append('jobPosition', workPosition || '');
            formData.append('careerGoal', careerGoal || '');
            formData.append('website', website || '');
            formData.append('nameCV', nameCV || '');
            formData.append('careerField', careerField || '');
            formData.append('about', about || '');

            // Gửi các mảng dưới dạng JSON string
            if (addWorkExperience.length > 0) {
                formData.append('workExperiences', JSON.stringify(addWorkExperience));
            }
            if (addEducation.length > 0) {
                formData.append('education', JSON.stringify(addEducation));
            }
            if (addSkillFrom.length > 0) {
                formData.append('skills', JSON.stringify(addSkillFrom));
            }
            if (addCertificates.length > 0) {
                const certPayload = [];
                const certFiles = [];

                addCertificates.forEach((cert) => {
                    certPayload.push({
                        name: cert.name,
                        organization: cert.organization,
                        issueDate: cert.issueDate,
                        expiryDate: cert.expiryDate,
                        credentialId: cert.credentialId,
                        credentialUrl: cert.credentialUrl,
                    });

                    if (cert.file) {
                        certFiles.push(cert.file); 
                    }
                });

                formData.append('certificates', JSON.stringify(certPayload));

                certFiles.forEach((file) => {
                    formData.append('certificateFiles', file);
                });
            }

            // GỌI ĐÚNG API MỚI CỦA BẠN
            const res = await httpRequest.post('/api/cv/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data' → KHÔNG CẦN, để browser tự set
                },
            });

            setAlertMessage('Tạo CV thành công!');
            setShowAlert(true);

            // console.log('Dữ liệu gửi đi:', {
            //     nameCV:nameCV,
            //     title: cvTitle,
            //     jobPosition: workPosition,
            //     workExperiences: addWorkExperience,
            //     education: addEducation,
            //     skills: addSkillFrom,
            //     attachments: addCertificates.length + (avatar ? 1 : 0) + ' files',
            // });
            setTimeout(() => {
                setShowAlert(false);
                navigate('/choose-cv'); // hoặc '/choose-cv' tùy bạn
            }, 3000);
        } catch (error) {
            console.error('Lỗi tạo CV:', error);
            setError(error.response?.data?.message || 'Tạo CV thất bại, vui lòng thử lại!');
        }
    };

    // hủy nhập thông tin
    const handleCancel = () => {
        // xóa state
        setNameUser('');
        setAvatar('');
        setGender('');
        setBirthDay('');
        setAddress('');
        setCareerField('');
        setAbout('');
        setWebsite('');
        setNameCV('');
        setCareerGoal('');
        setWorkPosition('');
        setAddWorkExperience([]);
        setAddSkillFrom([]);
        setAddEducation([]);
        setAddCertificates([]);

        // xóa localStorage
        localStorage.removeItem('regisInfo');

        // điều hướng về home
        navigate('/choose-cv');
    };

    return (
        <div className={cx('add-information')}>
            {showAlert && <div className={cx('custom-alert')}>{alertMessage}</div>}
            <form className={cx('wrapper')}>
                <div className={cx('header')}>Tạo thông tin CV </div>
                <div className={cx('main')}>
                    {/* name cv */}
                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.nameCV}</div>
                        <input
                            className={cx('m-item-input')}
                            placeholder="VD: Tên CV bạn muốn đăng ký"
                            value={nameCV}
                            onChange={(e) => setNameCV(e.target.value)}
                        />
                    </div>
                    {/* wedSide */}
                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.website}</div>
                        <input
                            className={cx('m-item-input')}
                            placeholder="VD: https://www.facebook.com/nguyen.toan.157547/?locale=vi_VN"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                    {/* work position */}
                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.workPosition}</div>
                        <input
                            className={cx('m-item-input')}
                            placeholder="VD: development"
                            value={workPosition}
                            onChange={(e) => setWorkPosition(e.target.value)}
                            required
                        />
                    </div>

                    {/* Career goals */}
                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.careerGoals}</div>
                        <textarea
                            className={cx('m-item-input', 'm-item-textarea')}
                            placeholder="VD: Mong muốn đối và đặt mục tiêu trong công việc..."
                            value={careerGoal}
                            onChange={(e) => setCareerGoal(e.target.value)}
                        />
                    </div>

                    <div className={cx('level-information')}>
                        {/* WorkExperience */}
                        <ToggleButton
                            classNames={cx('toggle-show')}
                            show={showWorkExperience}
                            onToggle={setShowWorkExperience}
                            labelShow="+ Kinh nghiệm làm việc"
                            labelHide="ẩn"
                        />
                        {showWorkExperience && (
                            <RegisWorkExperience value={addWorkExperience} onChange={handleAddWorkExperience} />
                        )}
                        {/* end WorkExperience */}

                        {/* SkillFrom */}
                        <ToggleButton
                            classNames={cx('toggle-show')}
                            show={showSkillForm}
                            onToggle={setShowSkillForm}
                            labelShow="+ Kỹ năng công việc"
                            labelHide="ẩn"
                        />

                        {showSkillForm && <RegisSkills value={addSkillFrom} onChange={handleAddSkillFrom} />}
                        {/* end SkillFrom */}

                        {/* Education */}
                        <ToggleButton
                            classNames={cx('toggle-show')}
                            show={showAddEducation}
                            onToggle={setShowAddEducation}
                            labelShow="+ Trình độ học vấn "
                            labelHide="ẩn"
                        />

                        {showAddEducation && <RegisEducation value={addEducation} onChange={handleAddEducation} />}
                        {/* end education */}

                        {/* Certificates */}
                        <ToggleButton
                            classNames={cx('toggle-show')}
                            show={showCertificates}
                            onToggle={setShowCertificates}
                            labelShow="+ Các chứng chỉ liên quang "
                            labelHide="ẩn"
                        />

                        {showCertificates && (
                            <RegisCertificates value={addCertificates} onChange={handleAddCertificates} />
                        )}
                        {/* end Certificates */}
                    </div>
                </div>

                {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '5px' }}> {error}</div>}

                <div className={cx('footer')}>
                    <button
                        className={cx('btn-cancel')}
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                    >
                        Huỷ
                    </button>

                    <button
                        className={cx('btn-register')}
                        onClick={(e) => {
                            e.preventDefault();
                            handleRegister();
                        }}
                    >
                        Đăng ký
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddInformation;
