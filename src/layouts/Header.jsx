import PrimaryButton from "@components/Button";

function Header() {
  return (
    <>
      <h1>標題一</h1>
      <h2>標題二</h2>
      <h3>標題三</h3>
      <h4>標題四</h4>
      <h5>標題五</h5>
      <p className="text-primary-100 fs-1">這是 header</p>
      <PrimaryButton>我是按鈕</PrimaryButton>
      <div className="button-l text-danger">Text-L</div>
      <div className="button-M text-primary-100">Text-M</div>
      <div className="button-S">Text-S</div>
      <div className="label">Label</div>
    </>
  );
}

export default Header;
