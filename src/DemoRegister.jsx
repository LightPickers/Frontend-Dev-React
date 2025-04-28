/* global alert, console */
///* global FormData */

import React, { useState } from "react";
import axios from "axios";

const DemoRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    gender: "",
    birthDate: "",
    addressZipcode: "",
    addressDistrict: "",
    addressDetail: "",
    photo: "",
  });

  const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // 月份從 0 開始，所以要加 1
    const day = d.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleFileChange = (e) => {
  //  setFormData({ ...formData, photo: e.target.files[0] });
  //};

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.phone ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.addressZipcode ||
      !formData.addressDistrict ||
      !formData.addressDetail
    ) {
      alert("請填寫所有欄位");
      return;
    }

    const formattedBirthDate = formatDate(formData.birthDate);

    const data = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      gender: formData.gender,
      birth_date: formattedBirthDate, // 使用格式化過的日期
      address_zipcode: formData.addressZipcode,
      address_district: formData.addressDistrict,
      address_detail: formData.addressDetail,
    };

    // if (formData.photo) {
    //   data.append("photo", formData.photo);
    // }
    const API_BASE = import.meta.env.VITE_API_BASE;

    try {
      const response = await axios.post(`${API_BASE}/users/signup`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("註冊成功！");
      }
    } catch (error) {
      console.error("註冊發生錯誤", error);
      alert("註冊失敗，請重試。");
    }
  };

  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card" style={{ width: "400px", padding: "20px", margin: "0 auto" }}>
          <h2 className="text-center">拾光堂 買家註冊</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                電子郵件
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                密碼
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                用戶名稱
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                電話
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">性別</label>
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                <label htmlFor="male">男</label>

                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                <label htmlFor="female">女</label>

                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                />
                <label htmlFor="other">其他</label>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label">
                生日
              </label>
              <input
                type="date"
                className="form-control"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="addressZipcode" className="form-label">
                郵遞區號
              </label>
              <input
                type="text"
                className="form-control"
                id="addressZipcode"
                name="addressZipcode"
                value={formData.addressZipcode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="addressDistrict" className="form-label">
                區域
              </label>
              <input
                type="text"
                className="form-control"
                id="addressDistrict"
                name="addressDistrict"
                value={formData.addressDistrict}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="addressDetail" className="form-label">
                詳細地址
              </label>
              <input
                type="text"
                className="form-control"
                id="addressDetail"
                name="addressDetail"
                value={formData.addressDetail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                上傳照片
              </label>
              <input type="text" className="text" id="photo" name="photo" onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              註冊
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DemoRegister;
