import React, { useState } from "react";
import { Accordion, Container } from "react-bootstrap";

function FAQPage() {
  return (
    <div className="faq-page py-5">
      <Container>
        <h1 className="text-center mb-5">常見問題</h1>

        <div className="faq-container">
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className="fw-bold">拾光堂的商品從哪裡來？如何保證品質？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  拾光堂的商品來源包含攝影師寄售、教學單位汰換器材以及我們主動收購的優質二手器材。每件商品上架前，
                  皆經快門數、對焦、感光元件與外觀等多項檢測，確保功能正常。
                </p>
                <p>
                  我們會依據外觀與功能將商品標示為「全新、九成新、良好、堪用」等等級，並附上實拍照片與詳細說明，
                  讓您能清楚了解商品實際狀況。
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <span className="fw-bold">拾光堂的商品有保固嗎？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>我們提供半年保固服務，符合「非人為因素造成的損壞」可免費維修。</p>
                <p>
                  保固只適用於「硬體故障」，人為損壞（如摔落、進水）或私自拆解則不在保固範圍。
                  請於購買後保留發票或訂單證明，以便後續維修或更換。
                </p>
                <p>
                  如需使用保固服務，請聯繫客服並提供購買憑證、問題描述及照片，經檢測後若符合條件，
                  我們會協助安排維修或更換。
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <span className="fw-bold">我想在拾光堂購物，該如何操作？有哪些付款方式？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  在網站註冊會員後，挑選喜歡的商品加入購物車，點選結帳確認收件資訊，
                  目前僅提供「信用卡一次付清」的付款方式（使用藍新金流）。完成付款後即可完成購買。
                </p>
                <p>
                  一般狀況下，週一至週五下午三點前完成訂單，當日即可出貨。 出貨後約 1-3
                  個工作天送達（若遇連假或天候因素，運送時間可能會延誤）。
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <span className="fw-bold">如果對商品不滿意，可以退換貨嗎？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  在商品簽收後 7 天內可申請退貨，但商品須保持未拆封、配件完整且保持原包裝的狀態。
                </p>
                <p>
                  若收到的商品有任何瑕疵或損壞，請先拍照留存，並於7天內聯繫客服，
                  客服人員會協助您申請退換貨並負擔回寄運費。
                </p>
                <p>
                  辦理退貨時，請先聯繫客服取得「退貨編號」，再依照指示將商品寄回。
                  我們會在收到並確認商品狀況後，於 5-7 個工作天內辦理退款。
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <span className="fw-bold">我是攝影新手，該如何選擇第一台相機？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>選擇第一台相機時，可以考慮以下幾點：</p>
                <ol>
                  <li>
                    <strong>用途：</strong>旅遊、日常生活、或拍影片？不同需求適合的相機類型不同。
                  </li>
                  <li>
                    <strong>預算：</strong>設定好預算區間，初學者一般建議2～3萬內。
                  </li>
                  <li>
                    <strong>便利性：</strong>
                    希望攜帶方便嗎？微單眼相機自動對焦快、支援錄影，且輕便又好操作，價格親民，是不少新手的首選。
                  </li>
                </ol>
                <p>如果您需要更多建議，歡迎聯繫我們的客服，我們會根據您的需求提供專業意見。</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>
                <span className="fw-bold">如何保養我的攝影器材？</span>
              </Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>平時不使用時，可以放在陰涼乾爽的地方。</li>
                  <li>在潮濕的日子，或在雨天後拍攝，建議把相機鏡頭放在防潮箱內，以免發霉。</li>
                  <li>每次使用前後可以用鏡頭筆和拭鏡布清潔鏡頭和相機。</li>
                  <li>可以用一塊滴有少許鏡頭清潔劑的軟布來小心擦拭指紋及其他污漬。</li>
                </ul>
                <p>正確的保養可以延長器材壽命，也能確保拍出的照片品質不受影響。</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>
                <span className="fw-bold">我想拍人像/街頭/風景，該選用什麼鏡頭？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>人像攝影：</strong>推薦使用定焦鏡，例如 50mm f/1.8 或 85mm
                  f/1.4，散景漂亮，能拍出淺景深的立體人像效果。
                </p>
                <p>
                  <strong>街頭攝影：</strong>可以選擇 35mm 或 28mm
                  定焦鏡，視角自然又不突兀，非常適合紀實與街拍。
                </p>
                <p>
                  <strong>風景攝影：</strong>推薦使用廣角鏡，如 16-35mm 或 10-18mm
                  的變焦鏡頭，適合拍攝壯闊場景與大自然。
                </p>
                <p>
                  拾光堂有多款適合不同主題的二手鏡頭，歡迎瀏覽我們的商品，
                  或直接詢問客服為您推薦適合的選擇。
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>
                <span className="fw-bold">不同品牌的相機有什麼特色？</span>
              </Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>
                    <strong>Canon：</strong>
                    操作介面直覺、膚色自然、鏡頭選擇豐富，是初學者與人像攝影愛好者的熱門選擇。
                  </li>
                  <li>
                    <strong>Nikon：</strong>
                    擅長動態範圍和細節保留，畫質出色，尤其適合拍風景與建築題材。
                  </li>
                  <li>
                    <strong>Sony：</strong>以輕巧、對焦快與錄影功能強著稱，特別適合 vlog
                    創作者與拍攝影片的使用者。
                  </li>
                  <li>
                    <strong>Fujifilm：</strong>
                    擁有經典復古外型與色彩直出功能，膠片模擬特效深受攝影愛好者喜愛。
                  </li>
                  <li>
                    <strong>Panasonic：</strong>LUMIX 以錄影性能聞名，支援 4K 甚至 6K 拍攝，適合
                    vlog 與影像創作用途。
                  </li>
                </ul>
                <p>每個品牌都有其優勢，建議您根據拍攝需求和個人喜好選擇適合的品牌。</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>
                <span className="fw-bold">拾光堂的運費和配送方式是怎樣的？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  目前僅提供「宅配到府」服務，每筆訂單收取固定「運費60元」。 出貨後約 1-3
                  個工作天送達，目前只提供國內配送。
                </p>
                <p>
                  一般狀況下，週一至週五下午三點前完成訂單，當日即可出貨。
                  若遇連假或天候因素，運送時間可能會延誤。
                </p>
                <p>尚未開放海外運送服務。若您有特殊需求，請直接聯繫客服，我們會視情況協助處理。</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9">
              <Accordion.Header>
                <span className="fw-bold">拾光堂的品牌理念是什麼？</span>
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  拾光堂於2025年由六位熱愛攝影與科技的夥伴共同創立，致力於推動二手攝影器材的透明交易與合理價格。
                </p>
                <p>
                  『拾光』代表拾起時間的記憶與光影的感動，『堂』象徵一個專業與溫暖的空間。
                  我們的品牌理念是讓每一位攝影愛好者都能安心入手二手商品，
                  並希望透過攝影器材的交流，讓每一位顧客都能重新拾起拍照的熱情。
                </p>
                <p>
                  拾光堂最大特色是由內部專業人員親自檢測與估價商品，並依據真實狀況分級，
                  讓購買更透明也更有保障。
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </div>
  );
}

export default FAQPage;
