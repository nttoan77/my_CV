import React from "react";
import classNames from "classnames/bind";
import styles from "./UserTable.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faUserShield } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const UserTable = ({ users, onEdit, onDelete, onChangeRole, className }) => {
  return (
    <table className={cx("user-table", className)}>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Email</th>
          <th>Số điện thoại</th>
          <th>Vị trí</th>
          <th>Quyền</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.nameUser}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.workPosition}</td>
            <td>{user.role}</td>
            <td>
              <button
                onClick={() =>
                  onChangeRole(user._id, user.role === "admin" ? "user" : "admin")
                }
                className={cx("admin-btn")}
              >
                <FontAwesomeIcon icon={faUserShield} />{" "}
                {user.role === "admin" ? "Gỡ quyền" : "Phân quyền"}
              </button>
              <button
                onClick={() => onEdit(user)}
                className={cx("edit-btn")}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                onClick={() => onDelete(user._id)}
                className={cx("delete-btn")}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
