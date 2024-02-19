import { useThemeBuilderStore } from "../../../store";
import { memo } from "react";
import "./index.scss";
import { getThemeImage } from "../../../utils";
import Upload from "../Upload";

const LogoUpload = memo(() => {
  const { defaultTheme } = useThemeBuilderStore((state) => state);

  return (
    <div className="flex gap-fix-md justify-between">
      <img
        className="w-[34px] h-[24px]"
        src={getThemeImage(defaultTheme.image)}
        alt="logo"
        height="24"
        width="34"
      />
      <Upload
        label="uploadLogo"
        accept="image/*"
        onUpload={(result) => {
          useThemeBuilderStore.setState({
            defaultTheme: {
              ...defaultTheme,
              image: result,
            },
          });
        }}
      />
    </div>
  );
});

export default LogoUpload;
