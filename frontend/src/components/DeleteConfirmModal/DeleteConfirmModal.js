// src/components/DeleteConfirmModal.jsx
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Tạo phiên bản SweetAlert hỗ trợ React (tùy chọn nếu muốn render component React bên trong)
const MySwal = withReactContent(Swal);

/**
 * Hiển thị popup xác nhận xóa đẹp mắt
 * @param {Object} options - Các tùy chỉnh
 * @param {string} options.title - Tiêu đề popup (mặc định: "Xác nhận xóa?")
 * @param {string} options.text - Nội dung mô tả (mặc định: "Bạn sẽ không thể khôi phục CV này!")
 * @param {string} options.confirmButtonText - Text nút xác nhận (mặc định: "Có, xóa ngay!")
 * @param {string} options.cancelButtonText - Text nút hủy (mặc định: "Hủy")
 * @param {Function} options.onConfirm - Hàm chạy khi người dùng xác nhận xóa
 * @param {Function} options.onCancel - Hàm chạy khi hủy (tùy chọn)
 */
export const showDeleteConfirm = ({
  title = 'Xác nhận xóa CV?',
  text = 'Bạn sẽ không thể khôi phục CV này sau khi xóa!',
  confirmButtonText = 'Có, xóa ngay!',
  cancelButtonText = 'Hủy',
  icon = 'warning',
  onConfirm,
  onCancel = () => {},
}) => {
  MySwal.fire({
    title: title,
    text: text,
    icon: icon, // warning, error, success, info, question
    showCancelButton: true,
    confirmButtonColor: '#d33', // Màu đỏ cho nút xóa
    cancelButtonColor: '#3085d6', // Màu xanh cho nút hủy
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    
    reverseButtons: true, // Đảo vị trí nút (hủy ở trái, xác nhận ở phải)
    focusCancel: true, // Focus mặc định vào nút hủy để tránh xóa nhầm
    customClass: {
      popup: 'delete-confirm-popup', // Để bạn tùy chỉnh CSS thêm nếu muốn
      confirmButton: 'swal2-confirm-btn',
      cancelButton: 'swal2-cancel-btn',
    },
    backdrop: true,
    allowOutsideClick: false, // Không cho click ngoài để đóng
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm(); // Thực hiện xóa
      Swal.fire({
        title: 'Đã xóa!',
        text: 'CV đã được xóa thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      onCancel();
    }
  });
};

// Export một hàm đơn giản để dùng nhanh
export default showDeleteConfirm;