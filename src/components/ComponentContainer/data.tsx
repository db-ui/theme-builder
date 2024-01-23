import { Fragment, ReactElement } from "react";
import {
  DBAlert,
  DBBadge,
  DBButton,
  DBCheckbox,
  DBDivider,
  DBInfotext,
  DBInput,
  DBLink,
  DBRadio,
  DBSelect,
  DBTag,
  DBTextarea,
} from "@db-ui/react-components";
import { DefaultVariantType } from "@db-ui/react-components/dist/shared/model";

export type ComponentList = {
  title: string;
  component: ReactElement;
};

const variants: DefaultVariantType[] = [
  "adaptive",
  "neutral",
  "critical",
  "informational",
  "warning",
  "successful",
];

const toUpperCase = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const components: ComponentList[] = [
  {
    title: "Button",
    component: (
      <div className="grid grid-cols-5 gap-fix-sm items-center">
        {["outlined", "solid", "text", "primary"].map((variant) => (
          <Fragment key={`button-${variant}`}>
            <h6>{toUpperCase(variant)}:</h6>
            <DBButton variant={variant}>Default</DBButton>
            <DBButton variant={variant} icon="account">
              Icon
            </DBButton>
            <DBButton variant={variant} disabled>
              Disabled
            </DBButton>
            <DBButton variant={variant} size="small">
              Small
            </DBButton>
          </Fragment>
        ))}
      </div>
    ),
  },
  {
    title: "Link",
    component: (
      <Fragment>
        <DBLink href="#">Text Link</DBLink>
        <DBLink href="#" variant="primary">
          Brand Text Link
        </DBLink>
        <DBLink href="#" disabled>
          Disabled Link
        </DBLink>
        <DBLink href="#" size="small">
          Small Link
        </DBLink>
      </Fragment>
    ),
  },
  {
    title: "Infotext",
    component: (
      <Fragment>
        {variants.map((variant) => (
          <DBInfotext key={`infotext-${variant}`} variant={variant}>
            {toUpperCase(variant)}
          </DBInfotext>
        ))}
        <DBInfotext size="small">Small</DBInfotext>
      </Fragment>
    ),
  },
  {
    title: "Tag",
    component: (
      <Fragment>
        <div className="flex flex-wrap gap-fix-sm">
          <h6>Weak:</h6>
          {variants.map((variant) => (
            <DBTag key={`tag-${variant}`} variant={variant}>
              Tag {variant}
            </DBTag>
          ))}
        </div>
        <div className="flex flex-wrap gap-fix-sm">
          <h6>Strong:</h6>
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
      </Fragment>
    ),
  },
  {
    title: "Badge",
    component: (
      <Fragment>
        <div className="flex flex-wrap gap-fix-sm">
          <h6>Weak:</h6>
          {variants.map((variant) => (
            <DBBadge key={`badge-${variant}`} variant={variant}>
              Badge {variant}
            </DBBadge>
          ))}
        </div>
        <div className="flex flex-wrap gap-fix-sm">
          <h6>Strong:</h6>
          {variants.map((variant) => (
            <DBBadge
              key={`badge-strong-${variant}`}
              variant={variant}
              emphasis="strong"
            >
              Badge {variant}
            </DBBadge>
          ))}
        </div>
      </Fragment>
    ),
  },
  {
    title: "Alert",
    component: (
      <Fragment>
        {variants.map((variant) => (
          <DBAlert
            variant={variant}
            type="alert"
            icon="account"
            headline="Variant"
            link={{ href: "#", text: "Link" }}
          >
            {toUpperCase(variant)}
          </DBAlert>
        ))}
        <DBAlert
          type="inline"
          icon="account"
          headline="Type"
          link={{ href: "#", text: "Link" }}
        >
          Inline
        </DBAlert>
      </Fragment>
    ),
  },
  {
    title: "Input",
    component: (
      <Fragment>
        {variants.map((variant) => (
          <DBInput
            labelVariant="floating"
            key={`input-${variant}`}
            variant={variant}
            label={toUpperCase(variant)}
            placeholder={toUpperCase(variant)}
            message={`${toUpperCase(variant)} Message`}
          />
        ))}

        <DBInput
          labelVariant="floating"
          label="Disabled"
          placeholder="Disabled"
          message="Disabled Message"
          disabled
        />

        <DBInput
          labelVariant="floating"
          label="Readonly"
          placeholder="Readonly"
          message="Readonly Message"
          readOnly
          value="Readonly"
        />

        <DBInput
          labelVariant="floating"
          label="Invalid"
          placeholder="Invalid"
          message="Invalid Message"
          invalid
        />

        <DBInput
          labelVariant="floating"
          label="Valid"
          placeholder="Valid"
          message="Valid Message"
          invalid={false}
        />
      </Fragment>
    ),
  },
  {
    title: "Checkbox",
    component: (
      <Fragment>
        <DBCheckbox name="checkbox">Checkbox</DBCheckbox>
        <DBCheckbox name="checkbox" checked>
          Checkbox
        </DBCheckbox>
        <DBCheckbox name="checkbox" invalid>
          Checkbox
        </DBCheckbox>
        <DBCheckbox name="checkbox" checked required>
          Checkbox
        </DBCheckbox>
      </Fragment>
    ),
  },
  {
    title: "Radio",
    component: (
      <Fragment>
        <DBRadio name="radio">Radio</DBRadio>
        <DBRadio name="radio2" checked>
          Radio
        </DBRadio>
        <DBRadio name="radio3" invalid>
          Radio
        </DBRadio>
        <DBRadio name="radio4" checked required>
          Radio
        </DBRadio>
      </Fragment>
    ),
  },

  {
    title: "Select",
    component: (
      <Fragment>
        {variants.map((variant) => (
          <DBSelect
            labelVariant="floating"
            key={`input-${variant}`}
            variant={variant}
            label={toUpperCase(variant)}
            placeholder={toUpperCase(variant)}
            message={`${toUpperCase(variant)} Message`}
          >
            <option>Option1</option>
            <option>Option2</option>
          </DBSelect>
        ))}

        <DBSelect
          labelVariant="floating"
          label="Disabled"
          placeholder="Disabled"
          message="Disabled Message"
          disabled
        >
          <option>Option1</option>
          <option>Option2</option>
        </DBSelect>

        <DBSelect
          labelVariant="floating"
          label="Readonly"
          placeholder="Readonly"
          message="Readonly Message"
          readOnly
          value="Readonly"
        >
          <option>Option1</option>
          <option>Option2</option>
        </DBSelect>

        <DBSelect
          labelVariant="floating"
          label="Invalid"
          placeholder="Invalid"
          message="Invalid Message"
          invalid
        >
          <option>Option1</option>
          <option>Option2</option>
        </DBSelect>

        <DBSelect
          labelVariant="floating"
          label="Valid"
          placeholder="Valid"
          message="Valid Message"
          invalid={false}
        >
          <option>Option1</option>
          <option>Option2</option>
        </DBSelect>
      </Fragment>
    ),
  },
  {
    title: "Textarea",
    component: (
      <Fragment>
        {variants.map((variant) => (
          <DBTextarea
            labelVariant="floating"
            key={`input-${variant}`}
            variant={variant}
            label={toUpperCase(variant)}
            placeholder={toUpperCase(variant)}
            message={`${toUpperCase(variant)} Message`}
          />
        ))}

        <DBTextarea
          labelVariant="floating"
          label="Disabled"
          placeholder="Disabled"
          message="Disabled Message"
          disabled
        />

        <DBTextarea
          labelVariant="floating"
          label="Readonly"
          placeholder="Readonly"
          message="Readonly Message"
          readOnly
          value="Readonly"
        />

        <DBTextarea
          labelVariant="floating"
          label="Invalid"
          placeholder="Invalid"
          message="Invalid Message"
          invalid
        />

        <DBTextarea
          labelVariant="floating"
          label="Valid"
          placeholder="Valid"
          message="Valid Message"
          invalid={false}
        />
      </Fragment>
    ),
  },
  {
    title: "Divider",
    component: (
      <Fragment>
        <DBDivider />
        <DBDivider emphasis="strong" />
      </Fragment>
    ),
  },
];
