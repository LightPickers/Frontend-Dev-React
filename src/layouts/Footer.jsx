import React from "react";
import { Link } from "react-router-dom";

import { TextLarge, TextMedium } from "@components/TextTypography";
import { FacebookIcon, InstagramIcon, LineIcon } from "@components/icons";

function Footer() {
  const APP_BASE = import.meta.env.VITE_APP_BASE;

  return (
    <footer className="footer py-6">
      <div className="container">
        <div className="row">
          {/* 品牌區域 */}
          <div className="col-lg-3 col-md-6 mb-4">
            <Link to="/" className="footer-brand-link mb-4 d-inline-block">
              <img src={`${APP_BASE}Logo.svg`} alt="拾光堂 logo" className="footer-logo" />
            </Link>
            <div className="social-links d-flex gap-2">
              <a
                href="https://www.facebook.com/share/16jKHuUjyT/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <FacebookIcon size={25} title="Facebook" />
              </a>
              <a
                href="https://www.instagram.com/light_pickers?igsh=Y2NleGdldDB0Z3Np"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <InstagramIcon size={25} title="Instagram" />
              </a>
            </div>
          </div>

          {/* 關於「拾光堂」 */}
          <div className="col-lg-2 col-md-6 mb-4">
            <TextLarge className="footer-title mb-3">關於「拾光堂」</TextLarge>
            <ul className="footer-links list-unstyled">
              <li>
                <TextMedium as={Link} to="/faq" className="footer-link">
                  常見問題
                </TextMedium>
              </li>
              <li>
                <TextMedium as={Link} to="/contact" className="footer-link">
                  聯絡我們
                </TextMedium>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <TextLarge className="footer-title mb-3">我想找相機</TextLarge>
            <ul className="footer-links list-unstyled">
              <li>
                <TextMedium as={Link} to="/products" className="footer-link">
                  精選商品
                </TextMedium>
              </li>
              <li>
                <TextMedium as={Link} to="/products" className="footer-link">
                  最新商品
                </TextMedium>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <TextLarge className="footer-title mb-3">收購流程</TextLarge>
            <ul className="footer-links list-unstyled">
              <li>
                <TextMedium className="footer-link">賣家須知</TextMedium>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <TextLarge className="footer-title mb-3">用戶服務</TextLarge>
            <ul className="footer-links list-unstyled">
              <li>
                <TextMedium as={Link} to="/account/profile/settings" className="footer-link">
                  會員中心
                </TextMedium>
              </li>
              <li>
                <TextMedium as={Link} to="/account/profile/orders" className="footer-link">
                  訂單查詢
                </TextMedium>
              </li>
            </ul>
          </div>
        </div>

        {/* 版權信息 */}
        <div className="row mt-4">
          <div className="col-12">
            <TextMedium as="p" className="copyright text-muted mb-0">
              © Copyright 2025 拾光堂
            </TextMedium>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
