import Button from "@components/Button";

function Header() {
  return (
    <>
      <p className="text-primary-600">這是 header</p>
      <button className="btn-custom cta" type="button">
        我是按鈕
      </button>
      <Button text={"cta"} size="cta" />
      <Button text={"large"} size="large" />
      <Button text={"medium"} size="medium" />
      <Button text={"small"} size="small" />
    </>
  );
}

export default Header;
