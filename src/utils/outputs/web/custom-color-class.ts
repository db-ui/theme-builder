export const generateCustomColorClass = (colorName: string): string => {
  return `.db-${colorName}-bg,
.db-${colorName}-bg [data-bg-weight="1"],
.db-${colorName}-bg [data-bg-weight="2"],
.db-${colorName}-bg [data-bg-weight="3"],
.db-${colorName}-bg-lvl-1,
.db-${colorName}-bg-lvl-2,
.db-${colorName}-bg-lvl-3,
.db-${colorName}-bg-transparent-full,
.db-${colorName}-bg-transparent-semi,
.db-${colorName}-contrast-high,
.db-${colorName}-contrast-high-interactive,
.db-${colorName}-contrast-low,
.db-${colorName}-contrast-low-interactive {
	background: var(--db-current-color-bg-enabled);
	color: var(--db-current-color-on-bg-enabled);
}
.db-${colorName}-bg [data-bg-weight="1"]:after,
.db-${colorName}-bg [data-bg-weight="1"]:before,
.db-${colorName}-bg [data-bg-weight="2"]:after,
.db-${colorName}-bg [data-bg-weight="2"]:before,
.db-${colorName}-bg [data-bg-weight="3"]:after,
.db-${colorName}-bg [data-bg-weight="3"]:before,
.db-${colorName}-bg-lvl-1:after,
.db-${colorName}-bg-lvl-1:before,
.db-${colorName}-bg-lvl-2:after,
.db-${colorName}-bg-lvl-2:before,
.db-${colorName}-bg-lvl-3:after,
.db-${colorName}-bg-lvl-3:before,
.db-${colorName}-bg-transparent-full:after,
.db-${colorName}-bg-transparent-full:before,
.db-${colorName}-bg-transparent-semi:after,
.db-${colorName}-bg-transparent-semi:before,
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
	--db-current-icon-color: var(--db-${colorName}-on-contrast-enabled);
	--db-current-color-enabled: var(--db-${colorName}-on-contrast-enabled);
	--db-current-color-bg-enabled: var(--db-${colorName}-contrast-high-enabled);
	--db-current-color-bg-hover: var(--db-${colorName}-contrast-high-hover);
	--db-current-color-bg-pressed: var(--db-${colorName}-contrast-high-pressed);
	--db-current-color-border: var(--db-${colorName}-contrast-high-enabled);
}
.db-${colorName}-contrast-high-interactive:hover {
	background: var(--db-${colorName}-contrast-high-hover);
}
.db-${colorName}-contrast-high-interactive:active {
	background: var(--db-${colorName}-contrast-high-pressed);
}
.db-${colorName}-contrast-low,
.db-${colorName}-contrast-low-interactive {
	--db-current-icon-color: var(--db-${colorName}-on-contrast-enabled);
	--db-current-color-enabled: var(--db-${colorName}-on-contrast-enabled);
	--db-current-color-bg-enabled: var(--db-${colorName}-contrast-low-enabled);
	--db-current-color-bg-hover: var(--db-${colorName}-contrast-low-hover);
	--db-current-color-bg-pressed: var(--db-${colorName}-contrast-low-pressed);
	--db-current-color-border: var(--db-${colorName}-contrast-low-enabled);
}
.db-${colorName}-contrast-low-interactive:hover {
	background: var(--db-${colorName}-contrast-low-hover);
}
.db-${colorName}-contrast-low-interactive:active {
	background: var(--db-${colorName}-contrast-low-pressed);
}
.db-${colorName}-bg,
.db-${colorName}-bg [data-bg-weight="1"],
.db-${colorName}-bg [data-bg-weight="2"],
.db-${colorName}-bg [data-bg-weight="3"],
.db-${colorName}-bg-lvl-1,
.db-${colorName}-bg-lvl-2,
.db-${colorName}-bg-lvl-3,
.db-${colorName}-bg-transparent-full,
.db-${colorName}-bg-transparent-semi {
	--db-current-color-bg-transparent-full-enabled: var(
		--db-${colorName}-bg-transparent-full-enabled
	);
	--db-current-color-bg-transparent-semi-enabled: var(
		--db-${colorName}-bg-transparent-semi-enabled
	);
	--db-current-color-bg-transparent-hover: var(
		--db-${colorName}-bg-transparent-hover
	);
	--db-current-color-bg-transparent-pressed: var(
		--db-${colorName}-bg-transparent-pressed
	);
	--db-current-color-enabled: var(--db-${colorName}-on-bg-enabled);
	--db-current-color-icon: var(--db-${colorName}-on-bg-enabled);
	--db-current-color-hover: var(--db-${colorName}-on-bg-hover);
	--db-current-color-pressed: var(--db-${colorName}-on-bg-pressed);
	--db-current-color-bg-lvl-1-enabled: var(--db-${colorName}-bg-lvl-1-enabled);
	--db-current-color-bg-lvl-2-enabled: var(--db-${colorName}-bg-lvl-2-enabled);
	--db-current-color-bg-lvl-3-enabled: var(--db-${colorName}-bg-lvl-3-enabled);
	--db-current-color-contrast-low-enabled: var(
		--db-${colorName}-contrast-low-enabled
	);
	--db-current-color-border: var(--db-${colorName}-border);
	--db-current-color-bg-lvl-1-hover: var(--db-${colorName}-bg-lvl-1-hover);
	--db-current-color-bg-lvl-1-pressed: var(--db-${colorName}-bg-lvl-1-pressed);
	--db-current-color-bg-lvl-2-hover: var(--db-${colorName}-bg-lvl-2-hover);
	--db-current-color-bg-lvl-2-pressed: var(--db-${colorName}-bg-lvl-2-pressed);
	--db-current-color-bg-lvl-3-hover: var(--db-${colorName}-bg-lvl-3-hover);
	--db-current-color-bg-lvl-3-pressed: var(--db-${colorName}-bg-lvl-3-pressed);
	--db-current-color-on-contrast-enabled: var(
		--db-${colorName}-on-contrast-enabled
	);
	--db-current-color-contrast-high-enabled: var(
		--db-${colorName}-contrast-high-enabled
	);
	--db-current-color-contrast-high-hover: var(
		--db-${colorName}-contrast-high-hover
	);
	--db-current-color-contrast-high-pressed: var(
		--db-${colorName}-contrast-high-pressed
	);
}
.db-${colorName}-bg [data-emphasis="weak"][data-bg-weight="1"],
.db-${colorName}-bg [data-emphasis="weak"][data-bg-weight="2"],
.db-${colorName}-bg [data-emphasis="weak"][data-bg-weight="3"],
[data-emphasis="weak"].db-${colorName}-bg,
[data-emphasis="weak"].db-${colorName}-bg-lvl-1,
[data-emphasis="weak"].db-${colorName}-bg-lvl-2,
[data-emphasis="weak"].db-${colorName}-bg-lvl-3,
[data-emphasis="weak"].db-${colorName}-bg-transparent-full,
[data-emphasis="weak"].db-${colorName}-bg-transparent-semi {
	--db-current-color-enabled: var(--db-${colorName}-on-bg-weak-enabled);
	--db-current-color-hover: var(--db-${colorName}-on-bg-weak-hover);
	--db-current-color-pressed: var(--db-${colorName}-on-bg-weak-pressed);
	color: var(--db-current-color-enabled);
}
.db-${colorName}-bg,
.db-${colorName}-bg [data-bg-weight="1"],
.db-${colorName}-bg-lvl-1 {
	--db-current-color-bg-enabled: var(--db-current-color-bg-lvl-1-enabled);
}
.db-${colorName}-bg [data-bg-weight="2"],
.db-${colorName}-bg-lvl-2 {
	--db-current-color-bg-enabled: var(--db-current-color-bg-lvl-2-enabled);
}
.db-${colorName}-bg [data-bg-weight="3"],
.db-${colorName}-bg-lvl-3 {
	--db-current-color-bg-enabled: var(--db-current-color-bg-lvl-3-enabled);
}
.db-${colorName}-bg-transparent-full {
	--db-current-color-bg-enabled: var(
		--db-current-color-bg-transparent-full-enabled
	);
}
.db-${colorName}-bg-transparent-semi {
	--db-current-color-bg-enabled: var(
		--db-current-color-bg-transparent-semi-enabled
	);
}
`;
};
