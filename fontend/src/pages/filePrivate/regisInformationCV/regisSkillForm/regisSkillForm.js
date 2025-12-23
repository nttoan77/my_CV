import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './regisSkillForm.module.scss';

const cx = classNames.bind(style);

function AddSkills({ value = [], onChange }) {
    // ✅ State cục bộ giữ dữ liệu
    const [skills, setSkills] = useState(value.length > 0 ? value : [{ type: 'hard', name: '', partials: [] }]);

    // ✅ Đồng bộ khi prop value thay đổi từ cha
    useEffect(() => {
        if (value && value.length > 0) {
            setSkills(value);
        }
    }, [value]);

    // Hàm update chung
    const updateSkills = (newSkills) => {
        setSkills(newSkills);
        onChange && onChange(newSkills);
    };

    // Cập nhật skill cha
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newSkills = [...skills];
        newSkills[index] = { ...newSkills[index], [name]: value };
        updateSkills(newSkills);
    };

    // Thêm skill cha
    const handleAdd = () => {
        updateSkills([...skills, { type: 'hard', name: '', partials: [] }]);
    };

    // Thêm partial
    const handleAddPartial = (index) => {
        const newSkills = [...skills];
        newSkills[index].partials.push({ name: '', level: '' });
        updateSkills(newSkills);
    };

    // Sửa partial
    const handleChangePartial = (skillIndex, partialIndex, field, value) => {
        const newSkills = [...skills];
        newSkills[skillIndex].partials[partialIndex][field] = value;
        updateSkills(newSkills);
    };

    // Xóa skill cha
    const handleRemove = (index) => {
        updateSkills(skills.filter((_, i) => i !== index));
    };

    // Xóa partial
    const handleRemovePartial = (skillIndex, partialIndex) => {
        const newSkills = [...skills];
        newSkills[skillIndex].partials = newSkills[skillIndex].partials.filter((_, i) => i !== partialIndex);
        updateSkills(newSkills);
    };

    return (
        <div className={cx('form-container')}>
            <h3>Kỹ năng</h3>
            {skills.map((skill, index) => (
                <div key={index} className={cx('form-item')}>
                    <div className={cx('form-group')}>
                        <label>Loại kỹ năng</label>
                        <select name="type" value={skill.type} onChange={(e) => handleChange(index, e)}>
                            <option value="hard">Kỹ năng cứng</option>
                            <option value="soft">Kỹ năng mềm</option>
                        </select>
                    </div>
                    <div className={cx('form-group')}>
                        <label>Tên kỹ năng</label>
                        <input
                            type="text"
                            name="name"
                            value={skill.name}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Nhập tên kỹ năng..."
                        />
                    </div>
                    {/* Partials */}
                    <div className={cx('partials')}>
                        <label>{skill.type === 'hard' ? 'Chi tiết kỹ năng cứng' : 'Chi tiết kỹ năng mềm'}</label>
                        {skill.partials.map((p, i) => (
                            <div key={i} className={cx('form-group-inline')}>
                                <input
                                    className={cx('partials-i')}
                                    type="text"
                                    value={p.name}
                                    onChange={(e) => handleChangePartial(index, i, 'name', e.target.value)}
                                    placeholder="Tên chi tiết..."
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePartial(index, i)}
                                    className={cx('btn-remove-children')}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddPartial(index)} className={cx('btn-add')}>
                            + Thêm chi tiết
                        </button>
                    </div>
                    {/* Nút xóa kỹ năng cha */}
                    {skills.length > 0 && (
                        <button type="button" className={cx('btn-remove')} onClick={() => handleRemove(index)}>
                            ✕
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={handleAdd} className={cx('btn-add')}>
                + Thêm kỹ năng
            </button>
        </div>
    );
}

export default AddSkills;
