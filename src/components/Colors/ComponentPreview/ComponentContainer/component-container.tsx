import {
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
import { useThemeBuilderStore } from "../../../../store";

const variants: DefaultVariantType[] = [
  "adaptive",
  "critical",
  "informational",
  "warning",
  "successful",
];
const ComponentContainer = () => {
  const { darkMode, defaultColors } = useThemeBuilderStore((state) => state);
  return (
    <DBCard className="w-full flex flex-col" spacing="medium">
      <div
        style={{
          backgroundColor: darkMode
            ? defaultColors.onBgNeutral
            : defaultColors.bgNeutral,
        }}
        className="flex flex-col gap-res-sm h-full"
      >
        <div className="component-container">
          <DBButton>Outlined Button</DBButton>
          <DBButton variant="solid">Filled Button</DBButton>
          <DBButton variant="text">Ghost Button</DBButton>
          <DBButton variant="primary">Brand Button</DBButton>
        </div>

        <div className="component-container">
          {variants.map((variant) => (
            <DBInput
              key={`input-${variant}`}
              variant={variant}
              label={variant}
              placeholder={variant}
              message={`${variant} Message`}
            />
          ))}
        </div>
        <div className="component-container"></div>
        <div className="flex flex-col gap-fix-md">
          <div className="component-container">
            {variants.map((variant) => (
              <DBTag key={`tag-${variant}`} variant={variant}>
                Tag {variant}
              </DBTag>
            ))}
          </div>

          <div className="component-container">
            {variants.map((variant) => (
              <DBTag
                key={`tag-strong-${variant}`}
                variant={variant}
                emphasis="strong"
              >
                Tag {variant}
              </DBTag>
            ))}
          </div>
        </div>

        <div className="component-container">
          <DBLink href="#">Text Link</DBLink>
          <DBLink href="#" variant="primary">
            Brand Text Link
          </DBLink>
          <DBCheckbox name="checkbox">Checkbox</DBCheckbox>
          <DBRadio name="radio">Radio</DBRadio>
        </div>
      </div>
    </DBCard>
  );
};

export default ComponentContainer;
