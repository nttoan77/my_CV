import classNames from "classnames/bind";
import styles from "./slideEducation.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function SlideEducation() {
  const [dataUser, setDataUser] = useState(null);
  const [certificates, setCertificates] = useState([]);

  // === LẤY DỮ LIỆU USER TỪ API ===
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("⚠️ Không tìm thấy userId trong localStorage.");
      return;
    }

    const FetchUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/${userId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("❌ Lỗi lấy user:", data?.message);
          return;
        }

        setDataUser(data);

        // === LẤY CERTIFICATE TRONG CV PROFILE ĐẦU TIÊN ===
        const cv = data.cvProfiles?.[0];

        if (cv?.certificate && Array.isArray(cv.certificate)) {
          const images = cv.certificate
            .filter(
              (cert) =>
                cert.file &&
                cert.file.url &&
                cert.file.mimetype &&
                cert.file.mimetype.startsWith("image")
            )
            .map((cert) => cert.file.url);

          setCertificates(images);
        }
      } catch (error) {
        console.error("❌ Lỗi Fetch:", error);
      }
    };

    FetchUser();
  }, []);

  if (!dataUser) return <div>Đang tải dữ liệu...</div>;
  if (certificates.length === 0) return <div>Chưa có ảnh chứng chỉ nào để hiển thị.</div>;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* Nút điều hướng trái */}
        <div className={cx("swiper-button-prev")}>
          <FontAwesomeIcon icon={faCircleArrowLeft} />
        </div>

        {/* Swiper */}
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView={3}
          initialSlide={Math.floor(certificates.length / 2)}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: `.${cx("swiper-button-next")}`,
            prevEl: `.${cx("swiper-button-prev")}`,
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          className={cx("swiper")}
        >
          {certificates.map((src, index) => (
            <SwiperSlide key={index} className={cx("slide")}>
              <div className={cx("slide-img")}>
                <img src={src} alt={`Chứng chỉ ${index + 1}`} className={cx("image")} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nút điều hướng phải */}
        <div className={cx("swiper-button-next")}>
          <FontAwesomeIcon icon={faCircleArrowRight} />
        </div>
      </div>
    </div>
  );
}

export default SlideEducation;
