import classNames from "classnames/bind";
import style from "./Education.module.scss";
import useInView from "~/components/hooks/useInView";
import SlideEducation from "./slideEducation/slideEducation";
import LevelEducation from "./levelEducation/levelEducation";

const cx = classNames.bind(style);

function Education({ data }) {
  const [ref, inView] = useInView(0.3);

  // Nếu Home chưa load xong hoặc API chưa trả về
  if (!data) {
    return <div className={cx("loading")}>Đang tải dữ liệu học vấn...</div>;
  }

  const educationList = data || [];

  return (
    <div ref={ref} className={cx("wrapper", { animate: inView })}>
      <div className={cx("content")}>
        <h2 className={cx("title")}>Học vấn</h2>

        {educationList.length > 0 ? (
          <div className={cx("main")}>
            {/* Tổng quát */}
            <LevelEducation data={educationList} />

            {/* Chi tiết */}
            <SlideEducation data={educationList} />
          </div>
        ) : (
          <p className={cx("loading")}>Chưa có dữ liệu học vấn.</p>
        )}
      </div>
    </div>
  );
}

export default Education;
