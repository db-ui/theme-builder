import {
  DBAlert,
  DBButton,
  DBCard,
  DBCheckbox,
  DBInput,
  DBLink,
  DBRadio,
  DBTag,
} from "@db-ui/react-components";
import "./index.scss";
import { DefaultVariantType } from "@db-ui/react-components/dist/shared/model";
import { useThemeBuilderStore } from "../../data";

const variants: DefaultVariantType[] = [
  "adaptive",
  "critical",
  "informational",
  "warning",
  "successful",
];
const ComponentPreview = () => {
  const { darkMode, defaultColors } = useThemeBuilderStore((state) => state);
  return (
    <DBCard className="component-container column-box" spacing="small">
      <div className="title-container">
        <strong>Components</strong>
      </div>
      <div
        style={{
          backgroundColor: darkMode
            ? defaultColors.onBgNeutral
            : defaultColors.bgNeutral0,
        }}
        className="component-color-container column-box"
      >
        <div>
          <DBButton>Adaptive Outlined</DBButton>
          <DBButton variant="solid">Adaptive Solid</DBButton>
          <DBButton variant="primary">Primary</DBButton>
        </div>
        <div>
          <DBLink href="#">Adaptive</DBLink>
          <DBLink href="#" variant="primary">
            Primary
          </DBLink>
        </div>
        <div>
          {variants.map((variant) => (
            <DBTag key={`tag-${variant}`} variant={variant}>
              {variant}
            </DBTag>
          ))}
        </div>
        <div>
          {variants.map((variant) => (
            <DBTag
              key={`tag-strong-${variant}`}
              variant={variant}
              type="strong"
            >
              {variant}
            </DBTag>
          ))}
        </div>

        <div>
          {variants.map((variant) => (
            <DBInput
              key={`input-${variant}`}
              variant={variant}
              label={variant}
              placeholder={variant}
              description={`${variant} Message`}
            />
          ))}
        </div>

        <div>
          <DBRadio name="radio">Adaptive</DBRadio>
          <DBCheckbox name="checkbox">Adaptive</DBCheckbox>
        </div>

        <div>
          {variants.map((variant) => (
            <DBAlert
              key={`alert-${variant}`}
              variant={variant}
              headline={variant}
              link={{ href: "#", text: "Link" }}
            >
              {variant}
            </DBAlert>
          ))}
        </div>
      </div>
    </DBCard>
  );
};

export default ComponentPreview;
