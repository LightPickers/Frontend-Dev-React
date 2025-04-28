import React, { useState } from "react";
import axios from "axios";

const DemoRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:3000/api/v1/users/signup", formData);
      if (response.status === 200) {
        alert("註冊成功！");
      }
    } catch (error) {
      console.error("註冊失敗", error);
    }
  };

  return (
    <div className="container">
      <h2>註冊</h2>
      <form onSubmit={submitForm}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">用戶名</label>
          <input
            type="text"
            id="username"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">電子郵件</label>
          <input
            type="email"
            id="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">密碼</label>
          <input
            type="password"
            id="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">註冊</button>
      </form>
    </div>
  );
};

export default DemoRegister;
