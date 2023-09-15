// TODO: Fix slots
import { domToReact, HTMLReactParserOptions } from "html-react-parser";
import {
  DBAccordion,
  DBAccordionItem,
  DBButton,
  DBBadge,
  DBAlert,
  DBCard,
  DBCheckbox,
  DBBrand,
  DBDrawer,
  DBDivider,
  DBHeader,
  DBInfotext,
  DBIcon,
  DBLink,
  DBInput,
  DBMainNavigation,
  DBNavigationItem,
  DBRadio,
  DBSection,
  DBPage,
  DBSelect,
  DBTextarea,
  DBTag,
} from "@db-ui/react-components";
import getAttributes from "./get-attributes.ts";
export const PARSER_OPTIONS: HTMLReactParserOptions = {
  transform: (reactNode: any) => {
    console.log(reactNode);
    if (
      reactNode.type &&
      reactNode.type.endsWith &&
      reactNode.type.endsWith("<")
    ) {
      return reactNode.type;
    }

    return reactNode;
  },
  replace: ({ name, attribs, children }: any) => {
    const attributes: any = getAttributes(attribs, PARSER_OPTIONS);

    if (name === "dbaccordion") {
      return (
        <DBAccordion {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBAccordion>
      );
    }
    if (name === "dbaccordionitem") {
      return (
        <DBAccordionItem {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBAccordionItem>
      );
    }
    if (name === "dbbutton") {
      return (
        <DBButton {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBButton>
      );
    }
    if (name === "dbbadge") {
      return (
        <DBBadge {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBBadge>
      );
    }
    if (name === "dbalert") {
      return (
        <DBAlert {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBAlert>
      );
    }
    if (name === "dbcard") {
      return (
        <DBCard {...attributes}>{domToReact(children, PARSER_OPTIONS)}</DBCard>
      );
    }
    if (name === "dbcheckbox") {
      return (
        <DBCheckbox {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBCheckbox>
      );
    }
    if (name === "dbbrand") {
      return (
        <DBBrand {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBBrand>
      );
    }
    if (name === "dbdrawer") {
      return (
        <DBDrawer {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBDrawer>
      );
    }
    if (name === "dbdivider") {
      return (
        <DBDivider {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBDivider>
      );
    }
    if (name === "dbheader") {
      return (
        <DBHeader {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBHeader>
      );
    }
    if (name === "dbinfotext") {
      return (
        <DBInfotext {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBInfotext>
      );
    }
    if (name === "dbicon") {
      return (
        <DBIcon {...attributes}>{domToReact(children, PARSER_OPTIONS)}</DBIcon>
      );
    }
    if (name === "dblink") {
      return (
        <DBLink {...attributes}>{domToReact(children, PARSER_OPTIONS)}</DBLink>
      );
    }
    if (name === "dbinput") {
      return (
        <DBInput {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBInput>
      );
    }
    if (name === "dbmainnavigation") {
      return (
        <DBMainNavigation {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBMainNavigation>
      );
    }
    if (name === "dbnavigationitem") {
      return (
        <DBNavigationItem {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBNavigationItem>
      );
    }
    if (name === "dbradio") {
      return (
        <DBRadio {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBRadio>
      );
    }
    if (name === "dbsection") {
      return (
        <DBSection {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBSection>
      );
    }
    if (name === "dbpage") {
      return (
        <DBPage {...attributes}>{domToReact(children, PARSER_OPTIONS)}</DBPage>
      );
    }
    if (name === "dbselect") {
      return (
        <DBSelect {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBSelect>
      );
    }
    if (name === "dbtextarea") {
      return (
        <DBTextarea {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </DBTextarea>
      );
    }
    if (name === "dbtag") {
      return (
        <DBTag {...attributes}>{domToReact(children, PARSER_OPTIONS)}</DBTag>
      );
    }
  },
};
