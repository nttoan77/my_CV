import classNames from "classnames/bind";
import style from "./AboutMe.module.scss";
import useInView from "~/components/hooks/useInView";
import ITCanvas from "./ITCanvas";

const cx = classNames.bind(style);

function AboutMe({ data }) {
  const [ref, inView] = useInView(0.3);

  if (!data) {
    return (
      <div className={cx("loading")}>
        Đang tải dữ liệu CV...
      </div>
    );
  }

  return (
    <div ref={ref} className={cx("wrapper", { animate: inView })}>

      {/* TEXT ABOUT ME */}
      <div className={cx("content")}>
        <div className={cx("textBox")}>
          {data.careerGoal ? (
            <p className={cx("text")}>{data.careerGoal}</p>
          ) : (
            <p className={cx("noData")}>
              Chưa có mục tiêu nghề nghiệp
            </p>
          )}
        </div>
      </div>

      {/* CANVAS */}
      <div className={cx("canvas")}>
        <ITCanvas />
      </div>
    </div>
  );
}

export default AboutMe;
