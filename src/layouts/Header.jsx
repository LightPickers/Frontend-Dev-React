import Button from "../components/Button";

function Header() {
  return (
    <>
      <p className="text-primary-600">這是 header</p>
      <button className="btn-custom cta" type="button">
        我是按鈕
      </button>
      <Button text={"註冊/登入"} size="large" className="text-danger" />
    </>
  );
}

export default Header;
