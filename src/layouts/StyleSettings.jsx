import { BtnPrimary } from "@components/Buttons";
import {
  H1Primary,
  H2Primary,
  H3Primary,
  H4Primary,
  H5Primary,
  H6Primary,
  H1Secondary,
  H2Secondary,
  H3Secondary,
  H4Secondary,
  H5Secondary,
  H6Secondary,
} from "@/components/Headings";

function StyleSettings() {
  return (
    <>
      <H2Primary>樣式設定</H2Primary>
      <H1Primary>H1Primary</H1Primary>
      <H2Primary>H2Primary</H2Primary>
      <H3Primary>H3Primary</H3Primary>
      <H4Primary>H4Primary</H4Primary>
      <H5Primary>H5Primary</H5Primary>
      <H6Primary>H6Primary</H6Primary>
      <hr />
      <H1Secondary>H1Secondary</H1Secondary>
      <H2Secondary>H2Secondary</H2Secondary>
      <H3Secondary>H3Secondary</H3Secondary>
      <H4Secondary>H4Secondary</H4Secondary>
      <H5Secondary>H5Secondary</H5Secondary>
      <H6Secondary>H6Secondary</H6Secondary>
      <hr />
      <H1Primary>isBold=false</H1Primary>
      <H1Primary isBold={false}>H1Primary</H1Primary>
      <H2Primary isBold={false}>H2Primary</H2Primary>
      <H3Primary isBold={false}>H3Primary</H3Primary>
      <H4Primary isBold={false}>H4Primary</H4Primary>
      <H5Primary isBold={false}>H5Primary</H5Primary>
      <H6Primary isBold={false}>H6Primary</H6Primary>
      <hr />
      <H3Primary>按鈕：BtnPrimary</H3Primary>
      <div className="d-flex gap-2">
        <BtnPrimary size="cta">size="cta"</BtnPrimary>
        <BtnPrimary size="large">size="large"</BtnPrimary>
        <BtnPrimary size="medium">size="medium"</BtnPrimary>
        <BtnPrimary size="small">size="small"</BtnPrimary>
      </div>
      <hr />
      <H3Primary>顏色設定</H3Primary>
      <div className="d-flex gap-2">
        <span className="text-primary-1000">primary-1000</span>
        <span className="text-primary-800">primary-800</span>
        <span className="text-primary-600">primary-600</span>
        <span className="text-primary-400">primary-400</span>
        <span className="text-primary-200">primary-200</span>
        <span className="text-primary-100">primary-100</span>
      </div>
      <hr />
      <div className="d-flex gap-2">
        <span className="text-success">success</span>
        <span className="text-danger">danger</span>
      </div>
      <div className="d-flex gap-2">
        <span className="text-white">white</span>
        <span className="text-gray-100">gray-100</span>
        <span className="text-gray-200">gray-200</span>
        <span className="text-gray-400">gray-400</span>
        <span className="text-gray-500">gray-500</span>
        <span className="text-gray-600">gray-600</span>
        <span className="text-gray-800">gray-800</span>
        <span className="text-gray-1000">gray-1000</span>
      </div>
    </>
  );
}

export default StyleSettings;
