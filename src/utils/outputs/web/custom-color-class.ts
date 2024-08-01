export const generateCustomColorClass = (colorName: string): string => {
  return `.db-${colorName}-bg,
.db-${colorName}-bg [data-bg-weight="1"],
.db-${colorName}-bg [data-bg-weight="2"],
.db-${colorName}-bg [data-bg-weight="3"],
.db-${colorName}-bg-basic-level-1,
.db-${colorName}-bg-basic-level-2,
.db-${colorName}-bg-basic-level-3,
.db-${colorName}-bg-basic-transparent-full,
.db-${colorName}-bg-basic-transparent-semi,
.db-${colorName}-contrast-high,
.db-${colorName}-contrast-high-interactive,
.db-${colorName}-contrast-low,
.db-${colorName}-contrast-low-interactive {
	background: var(--db-adaptive-bg-default);
	color: var(--db-adaptive-on-bg-basic-emphasis-100-default);
}
.db-${colorName}-bg [data-bg-weight="1"]:after,
.db-${colorName}-bg [data-bg-weight="1"]:before,
.db-${colorName}-bg [data-bg-weight="2"]:after,
.db-${colorName}-bg [data-bg-weight="2"]:before,
.db-${colorName}-bg [data-bg-weight="3"]:after,
.db-${colorName}-bg [data-bg-weight="3"]:before,
.db-${colorName}-bg-basic-level-1:after,
.db-${colorName}-bg-basic-level-1:before,
.db-${colorName}-bg-basic-level-2:after,
.db-${colorName}-bg-basic-level-2:before,
.db-${colorName}-bg-basic-level-3:after,
.db-${colorName}-bg-basic-level-3:before,
.db-${colorName}-bg-basic-transparent-full:after,
.db-${colorName}-bg-basic-transparent-full:before,
.db-${colorName}-bg-basic-transparent-semi:after,
.db-${colorName}-bg-basic-transparent-semi:before,
.db-${colorName}-bg:after,
.db-${colorName}-bg:before,
.db-${colorName}-contrast-high-interactive:after,
.db-${colorName}-contrast-high-interactive:before,
.db-${colorName}-contrast-high:after,
.db-${colorName}-contrast-high:before,
.db-${colorName}-contrast-low-interactive:after,
.db-${colorName}-contrast-low-interactive:before,
.db-${colorName}-contrast-low:after,
.db-${colorName}-contrast-low:before {
	color: var(--db-current-icon-color, inherit);
}
.db-${colorName}-contrast-high,
.db-${colorName}-contrast-high-interactive {
	--db-current-icon-color: var(--db-${colorName}-on-bg-inverted-default);
	--db-adaptive-default: var(--db-${colorName}-on-bg-inverted-default);
	--db-adaptive-bg-default: var(--db-${colorName}-bg-inverted-contrast-high-default);
	--db-adaptive-bg-hovered: var(--db-${colorName}-bg-inverted-contrast-high-hovered);
	--db-adaptive-bg-pressed: var(--db-${colorName}-bg-inverted-contrast-high-pressed);
	--db-adaptive-on-bg-basic-emphasis-60-default: var(--db-${colorName}-bg-inverted-contrast-high-default);
}
.db-${colorName}-contrast-high-interactive:hover {
	background: var(--db-${colorName}-bg-inverted-contrast-high-hovered);
}
.db-${colorName}-contrast-high-interactive:active {
	background: var(--db-${colorName}-bg-inverted-contrast-high-pressed);
}
.db-${colorName}-contrast-low,
.db-${colorName}-contrast-low-interactive {
	--db-current-icon-color: var(--db-${colorName}-on-bg-inverted-default);
	--db-adaptive-default: var(--db-${colorName}-on-bg-inverted-default);
	--db-adaptive-bg-default: var(--db-${colorName}-on-bg-basic-emphasis-70-default);
	--db-adaptive-bg-hovered: var(--db-${colorName}-bg-inverted-contrast-low-hovered);
	--db-adaptive-bg-pressed: var(--db-${colorName}-bg-inverted-contrast-low-pressed);
	--db-adaptive-on-bg-basic-emphasis-60-default: var(--db-${colorName}-on-bg-basic-emphasis-70-default);
}
.db-${colorName}-contrast-low-interactive:hover {
	background: var(--db-${colorName}-bg-inverted-contrast-low-hovered);
}
.db-${colorName}-contrast-low-interactive:active {
	background: var(--db-${colorName}-bg-inverted-contrast-low-pressed);
}
.db-${colorName}-bg,
.db-${colorName}-bg [data-bg-weight="1"],
.db-${colorName}-bg [data-bg-weight="2"],
.db-${colorName}-bg [data-bg-weight="3"],
.db-${colorName}-bg-basic-level-1,
.db-${colorName}-bg-basic-level-2,
.db-${colorName}-bg-basic-level-3,
.db-${colorName}-bg-basic-transparent-full,
.db-${colorName}-bg-basic-transparent-semi {
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
	--db-adaptive-default: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
	--db-adaptive-icon: var(--db-${colorName}-on-bg-basic-emphasis-100-default);
	--db-adaptive-hovered: var(--db-${colorName}-on-bg-basic-emphasis-100-hovered);
	--db-adaptive-pressed: var(--db-${colorName}-on-bg-basic-emphasis-100-pressed);
	--db-adaptive-bg-basic-level-1-default: var(--db-${colorName}-bg-basic-level-1-default);
	--db-adaptive-bg-basic-level-2-default: var(--db-${colorName}-bg-basic-level-2-default);
	--db-adaptive-bg-basic-level-3-default: var(--db-${colorName}-bg-basic-level-3-default);
	--db-adaptive-on-bg-basic-emphasis-70-default: var(
		--db-${colorName}-on-bg-basic-emphasis-70-default
	);
	--db-adaptive-on-bg-basic-emphasis-60-default: var(--db-${colorName}-border);
	--db-adaptive-bg-basic-level-1-hovered: var(--db-${colorName}-bg-basic-level-1-hovered);
	--db-adaptive-bg-basic-level-1-pressed: var(--db-${colorName}-bg-basic-level-1-pressed);
	--db-adaptive-bg-basic-level-2-hovered: var(--db-${colorName}-bg-basic-level-2-hovered);
	--db-adaptive-bg-basic-level-2-pressed: var(--db-${colorName}-bg-basic-level-2-pressed);
	--db-adaptive-bg-basic-level-3-hovered: var(--db-${colorName}-bg-basic-level-3-hovered);
	--db-adaptive-bg-basic-level-3-pressed: var(--db-${colorName}-bg-basic-level-3-pressed);
	--db-adaptive-on-bg-inverted-default: var(
		--db-${colorName}-on-bg-inverted-default
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
}
.db-${colorName}-bg [data-emphasis="weak"][data-bg-weight="1"],
.db-${colorName}-bg [data-emphasis="weak"][data-bg-weight="2"],
.db-${colorName}-bg [data-emphasis="weak"][data-bg-weight="3"],
[data-emphasis="weak"].db-${colorName}-bg,
[data-emphasis="weak"].db-${colorName}-bg-basic-level-1,
[data-emphasis="weak"].db-${colorName}-bg-basic-level-2,
[data-emphasis="weak"].db-${colorName}-bg-basic-level-3,
[data-emphasis="weak"].db-${colorName}-bg-basic-transparent-full,
[data-emphasis="weak"].db-${colorName}-bg-basic-transparent-semi {
	--db-adaptive-default: var(--db-${colorName}-on-bg-basic-emphasis-90-default);
	--db-adaptive-hovered: var(--db-${colorName}-on-bg-basic-emphasis-90-hovered);
	--db-adaptive-pressed: var(--db-${colorName}-on-bg-basic-emphasis-90-pressed);
	color: var(--db-adaptive-default);
}
.db-${colorName}-bg,
.db-${colorName}-bg [data-bg-weight="1"],
.db-${colorName}-bg-basic-level-1 {
	--db-adaptive-bg-default: var(--db-adaptive-bg-basic-level-1-default);
}
.db-${colorName}-bg [data-bg-weight="2"],
.db-${colorName}-bg-basic-level-2 {
	--db-adaptive-bg-default: var(--db-adaptive-bg-basic-level-2-default);
}
.db-${colorName}-bg [data-bg-weight="3"],
.db-${colorName}-bg-basic-level-3 {
	--db-adaptive-bg-default: var(--db-adaptive-bg-basic-level-3-default);
}
.db-${colorName}-bg-basic-transparent-full {
	--db-adaptive-bg-default: var(
		--db-adaptive-bg-basic-transparent-full-default
	);
}
.db-${colorName}-bg-basic-transparent-semi {
	--db-adaptive-bg-default: var(
		--db-adaptive-bg-basic-transparent-semi-default
	);
}
`;
};
