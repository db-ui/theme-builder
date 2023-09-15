export type Template = {
  key: string;
  label: string;
  content: string;
};
export const TEMPLATES: Template[] = [
  {
    key: "page",
    label: "Page",
    content: `<DBPage 
type="fixedHeaderFooter"
slotHeader="
<DBHeader slotBrand='<DBBrand>Editor</DBBrand>'>
    <DBMainNavigation>
        <DBNavigationItem active='true'><a>Nav1</a></DBNavigationItem>
        <DBNavigationItem><a>Nav2</a></DBNavigationItem>
        <DBNavigationItem><a>Nav3</a></DBNavigationItem>
    </DBMainNavigation>
</DBHeader>
"
>
<DBSection className="db-bg-informational">
    <div className="grid grid-cols-2">
        <p>Test</p>
        <p className="db-ui-functional">Test</p>
    </div>
</DBSection>
</DBPage>`,
  },
  {
    key: "components",
    label: "Components",
    content: `<div className="db-ui-regular">
    <div className="flex flex-col p-fix-md gap-fix-md">
        <h4>Buttons:</h4>
        <div className="flex gap-fix-md">
            <DBButton>Outlined</DBButton>
            <DBButton variant="solid">Solid</DBButton>
            <DBButton variant="text">Text</DBButton>
            <DBButton variant="primary">Primary</DBButton>
        </div>
        
        <h4>Links:</h4>
        <div className="flex gap-fix-md">
            <DBLink href="">Adaptive</DBLink>
            <DBLink href="" variant="primary">Primary</DBLink>
        </div>
    </div>
</div>
`,
  },
];
