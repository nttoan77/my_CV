import classNames from "classnames/bind";
import style from "./ProfessionalSkill.module.scss";
import useInView from "~/components/hooks/useInView";

const cx = classNames.bind(style);

function ProfessionalSkill({ data }) {
  const [ref, inView] = useInView(0.3);

  if (!data) return <div>Đang tải dữ liệu kỹ năng...</div>;

  // ✅ Lấy skills từ CV đầu tiên
  const skillList = data.cvProfiles?.[0]?.skills || [];

  return (
    <div ref={ref} className={cx("wrapper", { animate: inView })}>
      <div className={cx("content")}>
        <h2 className={cx("title")}>Kỹ năng chuyên môn</h2>

        <div className={cx("skillsList")}>
          {skillList.length > 0 ? (
            skillList.map((skill, idx) => (
              <div key={idx} className={cx("section")}>
                <h3 className={cx("category")}>{skill.name}</h3>

                <ul className={cx("skillItems")}>
                  {skill.partials?.map((p, i) => (
                    <li key={i} className={cx("skillItem")}>
                      <span className={cx("dot")}>•</span> {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className={cx("loading")}>Chưa có kỹ năng nào được thêm.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessionalSkill;
