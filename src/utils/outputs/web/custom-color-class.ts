export const generateCustomColorClass = (colorName: string): string => {
  return `[data-color=${colorName}],
.db-color-${colorName}, [data-color=${colorName}-bg-basic-level-3],
.db-${colorName}-bg-basic-level-3, [data-color=${colorName}-bg-basic-level-2],
.db-${colorName}-bg-basic-level-2, [data-color=${colorName}-bg-basic-level-1],
.db-${colorName}-bg-basic-level-1 {
  --db-adaptive-bg-basic-level-1-default: var(
  	--db-${colorName}-bg-basic-level-1-default
  );
  --db-adaptive-bg-basic-level-1-hovered: var(
  	--db-${colorName}-bg-basic-level-1-hovered
  );
  --db-adaptive-bg-basic-level-1-pressed: var(
  	--db-${colorName}-bg-basic-level-1-pressed
  );
  --db-adaptive-bg-basic-level-2-default: var(
  	--db-${colorName}-bg-basic-level-2-default
  );
  --db-adaptive-bg-basic-level-2-hovered: var(
  	--db-${colorName}-bg-basic-level-2-hovered
  );
  --db-adaptive-bg-basic-level-2-pressed: var(
  	--db-${colorName}-bg-basic-level-2-pressed
  );
  --db-adaptive-bg-basic-level-3-default: var(
  	--db-${colorName}-bg-basic-level-3-default
  );
  --db-adaptive-bg-basic-level-3-hovered: var(
  	--db-${colorName}-bg-basic-level-3-hovered
  );
  --db-adaptive-bg-basic-level-3-pressed: var(
  	--db-${colorName}-bg-basic-level-3-pressed
  );
  --db-adaptive-bg-basic-transparent-full-default: var(
  	--db-${colorName}-bg-basic-transparent-full-default
  );
  --db-adaptive-bg-basic-transparent-semi-default: var(
  	--db-${colorName}-bg-basic-transparent-semi-default
  );
  --db-adaptive-bg-basic-transparent-hovered: var(
  	--db-${colorName}-bg-basic-transparent-hovered
  );
  --db-adaptive-bg-basic-transparent-pressed: var(
  	--db-${colorName}-bg-basic-transparent-pressed
  );
  --db-adaptive-on-bg-basic-emphasis-100-default: var(
  	--db-${colorName}-on-bg-basic-emphasis-100-default
  );
  --db-adaptive-on-bg-basic-emphasis-100-hovered: var(
  	--db-${colorName}-on-bg-basic-emphasis-100-hovered
  );
  --db-adaptive-on-bg-basic-emphasis-100-pressed: var(
  	--db-${colorName}-on-bg-basic-emphasis-100-pressed
  );
  --db-adaptive-on-bg-basic-emphasis-90-default: var(
  	--db-${colorName}-on-bg-basic-emphasis-90-default
  );
  --db-adaptive-on-bg-basic-emphasis-90-hovered: var(
  	--db-${colorName}-on-bg-basic-emphasis-90-hovered
  );
  --db-adaptive-on-bg-basic-emphasis-90-pressed: var(
  	--db-${colorName}-on-bg-basic-emphasis-90-pressed
  );
  --db-adaptive-on-bg-basic-emphasis-80-default: var(
  	--db-${colorName}-on-bg-basic-emphasis-80-default
  );
  --db-adaptive-on-bg-basic-emphasis-80-hovered: var(
  	--db-${colorName}-on-bg-basic-emphasis-80-hovered
  );
  --db-adaptive-on-bg-basic-emphasis-80-pressed: var(
  	--db-${colorName}-on-bg-basic-emphasis-80-pressed
  );
  --db-adaptive-on-bg-basic-emphasis-70-default: var(
  	--db-${colorName}-on-bg-basic-emphasis-70-default
  );
  --db-adaptive-on-bg-basic-emphasis-70-hovered: var(
  	--db-${colorName}-on-bg-basic-emphasis-70-hovered
  );
  --db-adaptive-on-bg-basic-emphasis-70-pressed: var(
  	--db-${colorName}-on-bg-basic-emphasis-70-pressed
  );
  --db-adaptive-on-bg-basic-emphasis-60-default: var(
  	--db-${colorName}-on-bg-basic-emphasis-60-default
  );
  --db-adaptive-on-bg-basic-emphasis-60-hovered: var(
  	--db-${colorName}-on-bg-basic-emphasis-60-hovered
  );
  --db-adaptive-on-bg-basic-emphasis-60-pressed: var(
  	--db-${colorName}-on-bg-basic-emphasis-60-pressed
  );
  --db-adaptive-on-bg-basic-emphasis-50-default: var(
  	--db-${colorName}-on-bg-basic-emphasis-50-default
  );
  --db-adaptive-on-bg-basic-emphasis-50-hovered: var(
  	--db-${colorName}-on-bg-basic-emphasis-50-hovered
  );
  --db-adaptive-on-bg-basic-emphasis-50-pressed: var(
  	--db-${colorName}-on-bg-basic-emphasis-50-pressed
  );
  --db-adaptive-bg-inverted-contrast-max-default: var(
  	--db-${colorName}-bg-inverted-contrast-max-default
  );
  --db-adaptive-bg-inverted-contrast-max-hovered: var(
  	--db-${colorName}-bg-inverted-contrast-max-hovered
  );
  --db-adaptive-bg-inverted-contrast-max-pressed: var(
  	--db-${colorName}-bg-inverted-contrast-max-pressed
  );
  --db-adaptive-bg-inverted-contrast-high-default: var(
  	--db-${colorName}-bg-inverted-contrast-high-default
  );
  --db-adaptive-bg-inverted-contrast-high-hovered: var(
  	--db-${colorName}-bg-inverted-contrast-high-hovered
  );
  --db-adaptive-bg-inverted-contrast-high-pressed: var(
  	--db-${colorName}-bg-inverted-contrast-high-pressed
  );
  --db-adaptive-bg-inverted-contrast-low-default: var(
  	--db-${colorName}-bg-inverted-contrast-low-default
  );
  --db-adaptive-bg-inverted-contrast-low-hovered: var(
  	--db-${colorName}-bg-inverted-contrast-low-hovered
  );
  --db-adaptive-bg-inverted-contrast-low-pressed: var(
  	--db-${colorName}-bg-inverted-contrast-low-pressed
  );
  --db-adaptive-on-bg-inverted-default: var(
  	--db-${colorName}-on-bg-inverted-default
  );
  --db-adaptive-on-bg-inverted-hovered: var(
  	--db-${colorName}-on-bg-inverted-hovered
  );
  --db-adaptive-on-bg-inverted-pressed: var(
  	--db-${colorName}-on-bg-inverted-pressed
  );
  --db-adaptive-origin-default: var(--db-${colorName}-origin-default);
  --db-adaptive-origin-hovered: var(--db-${colorName}-origin-hovered);
  --db-adaptive-origin-pressed: var(--db-${colorName}-origin-pressed);
  --db-adaptive-on-origin-default: var(
  	--db-${colorName}-on-origin-default
  );
  --db-adaptive-on-origin-hovered: var(
  	--db-${colorName}-on-origin-hovered
  );
  --db-adaptive-on-origin-pressed: var(
  	--db-${colorName}-on-origin-pressed
  );
}

[data-color=${colorName}-bg-basic-level-1],
.db-${colorName}-bg-basic-level-1 {
  background-color: var(--db-${colorName}-bg-basic-level-1-default);
  color: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
}
[data-color=${colorName}-bg-basic-level-1]::before,
.db-${colorName}-bg-basic-level-1::before, [data-color=${colorName}-bg-basic-level-1]::after,
.db-${colorName}-bg-basic-level-1::after {
  --db-icon-color: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
}

[data-color=${colorName}-bg-basic-level-2],
.db-${colorName}-bg-basic-level-2 {
  background-color: var(--db-${colorName}-bg-basic-level-2-default);
  color: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
}
[data-color=${colorName}-bg-basic-level-2]::before,
.db-${colorName}-bg-basic-level-2::before, [data-color=${colorName}-bg-basic-level-2]::after,
.db-${colorName}-bg-basic-level-2::after {
  --db-icon-color: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
}

[data-color=${colorName}-bg-basic-level-3],
.db-${colorName}-bg-basic-level-3 {
  background-color: var(--db-${colorName}-bg-basic-level-3-default);
  color: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
}
[data-color=${colorName}-bg-basic-level-3]::before,
.db-${colorName}-bg-basic-level-3::before, [data-color=${colorName}-bg-basic-level-3]::after,
.db-${colorName}-bg-basic-level-3::after {
  --db-icon-color: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
}

[data-color=${colorName}],
.db-color-${colorName} {
  color: var(--db-adaptive-on-bg-basic-emphasis-100-default);
  background-color: var(--db-adaptive-bg-basic-level-1-default);
}
`;
};
