import classNames from "classnames/bind";
import styles from "./levelEducation.module.scss";
import useInView from "~/components/hooks/useInView";

const cx = classNames.bind(styles);

function LevelEducation({ data }) {
  const [ref, inView] = useInView(0.3);

  // Nếu không có data hoặc mảng rỗng
  if (!data || data.length === 0) {
    return (
      <div className={cx("study-empty")}>
        <p>Chưa có dữ liệu học tập.</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={cx("study-container", { animate: inView })}>
      <h2 className={cx("study-title")}>Thông tin học tập</h2>

      <div className={cx("study-list")}>
        {data.map((item, index) => (
          <div key={index} className={cx("study-card")}>

            {/* ======= HEADER ======= */}
            <div className={cx("study-header")}>
              <div className={cx("study-info")}>
                <h3 className={cx("study-school")}>
                  {item.school || "Chưa có tên trường"}
                </h3>

                <p className={cx("study-degree")}>
                  {item.degree || "Chưa có bằng cấp"}
                  {item.fieldOfStudy && ` • ${item.fieldOfStudy}`}
                </p>
              </div>

              <div className={cx("study-time")}>
                {(item.startDate || "Không rõ")} – {(item.endDate || "Hiện tại")}
              </div>
            </div>

            {/* ======= DESCRIPTION ======= */}
            {item.description && (
              <p className={cx("study-description")}>{item.description}</p>
            )}

            {/* ======= ACHIEVEMENTS ======= */}
            {Array.isArray(item.achievements) && item.achievements.length > 0 && (
              <div className={cx("study-achievements")}>
                <h4>Thành tích nổi bật</h4>
                <ul>
                  {item.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default LevelEducation;
