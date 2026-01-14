import { useEffect, useState } from "react";
import httpRequest from "~/utils/httpRequest";
import styles from "./Trash.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Trash() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    try {
      const res = await httpRequest.get("/api/cv/trash");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Lỗi lấy thùng rác", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id) => {
    try {
      await httpRequest.patch(`/api/cv/${id}/restore`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Lỗi khôi phục", err);
    }
  };

  const handleForceDelete = async (id) => {
    const ok = window.confirm("Xóa vĩnh viễn? Không thể khôi phục!");
    if (!ok) return;

    try {
      await httpRequest.delete(`/api/cv/${id}/force`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Lỗi xóa vĩnh viễn", err);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={cx("trash")}>
      <h2>🗑️ Thùng rác</h2>

      {items.length === 0 && <p>Không có dữ liệu trong thùng rác</p>}

      {items.map((item) => (
        <div key={item._id} className={cx("item")}>
          <div>
            <strong>{item.title}</strong>
            <p>
              Đã xóa lúc:{" "}
              {item.deletedAt
                ? new Date(item.deletedAt).toLocaleString()
                : "--"}
            </p>
          </div>

          <div className={cx("actions")}>
            <button onClick={() => handleRestore(item._id)}>
              ♻️ Khôi phục
            </button>
            <button
              className={cx("danger")}
              onClick={() => handleForceDelete(item._id)}
            >
              🗑️ Xóa vĩnh viễn
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Trash;
