import { Fragment, ReactElement } from "react";
import {
  DBNotification,
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
} from "@db-ux/react-core-components";
import { SemanticType } from "@db-ux/react-core-components/dist/shared/model";

export type ComponentList = {
  title: string;
  component: ReactElement;
};

const variants: SemanticType[] = [
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
        {["outlined", "filled", "ghost", "brand"].map((variant) => (
          <Fragment key={`button-${variant}`}>
            <h6>{toUpperCase(variant)}:</h6>
            <DBButton variant={variant}>Default</DBButton>
            <DBButton variant={variant} icon="person">
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
        <DBLink href="#" variant="brand">
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
          <DBInfotext key={`infotext-${variant}`} semantic={variant}>
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
            <DBTag key={`tag-${variant}`} semantic={variant}>
              Tag {variant}
            </DBTag>
          ))}
        </div>
        <div className="flex flex-wrap gap-fix-sm">
          <h6>Strong:</h6>
          {variants.map((variant) => (
            <DBTag
              key={`tag-strong-${variant}`}
              semantic={variant}
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
            <DBBadge key={`badge-${variant}`} semantic={variant}>
              Badge {variant}
            </DBBadge>
          ))}
        </div>
        <div className="flex flex-wrap gap-fix-sm">
          <h6>Strong:</h6>
          {variants.map((variant) => (
            <DBBadge
              key={`badge-strong-${variant}`}
              semantic={variant}
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
    title: "Notification",
    component: (
      <Fragment>
        {variants.map((variant) => (
          <DBNotification
            key={`alert-component-${variant}`}
            semantic={variant}
            variant="standalone"
            headline="Variant"
            linkVariant="inline"
            link={<a href="#">Link</a>}
          >
            {toUpperCase(variant)}
          </DBNotification>
        ))}
        <DBNotification
          variant="docked"
          icon="person"
          headline="Type"
          linkVariant="inline"
          link={<a href="#">Link</a>}
        >
          Docked
        </DBNotification>
      </Fragment>
    ),
  },
  {
    title: "Input",
    component: (
      <Fragment>
        <DBInput
          variant="floating"
          label="Disabled"
          placeholder="Disabled"
          message="Disabled Message"
          disabled
        />

        <DBInput
          variant="floating"
          label="Readonly"
          placeholder="Readonly"
          message="Readonly Message"
          readOnly
          value="Readonly"
        />

        <DBInput
          variant="floating"
          label="Required"
          placeholder="Required"
          message="Required Message"
          required
        />
      </Fragment>
    ),
  },
  {
    title: "Checkbox",
    component: (
      <Fragment>
        <DBCheckbox name="checkbox">Checkbox</DBCheckbox>
        <DBCheckbox name="checkbox" required>
          Checkbox required
        </DBCheckbox>
      </Fragment>
    ),
  },
  {
    title: "Radio",
    component: (
      <Fragment>
        <DBRadio name="radio">Radio</DBRadio>
        <DBRadio name="radio" required>
          Radio required
        </DBRadio>
      </Fragment>
    ),
  },

  {
    title: "Select",
    component: (
      <Fragment>
        <DBSelect
          variant="floating"
          label="Select"
          placeholder="Select"
          message="Select Message"
          disabled
        >
          <option>Option1</option>
          <option>Option2</option>
        </DBSelect>

        <DBSelect
          variant="floating"
          label="Disabled"
          placeholder="Disabled"
          message="Disabled Message"
          disabled
        >
          <option>Option1</option>
          <option>Option2</option>
        </DBSelect>

        <DBSelect
          variant="floating"
          label="Required"
          placeholder="Required"
          message="Required Message"
          required
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
        <DBTextarea
          variant="floating"
          label="Disabled"
          placeholder="Disabled"
          message="Disabled Message"
          disabled
        />

        <DBTextarea
          variant="floating"
          label="Readonly"
          placeholder="Readonly"
          message="Readonly Message"
          readOnly
          value="Readonly"
        />

        <DBTextarea
          variant="floating"
          label="Required"
          placeholder="Required"
          message="Required Message"
          required
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
