import * as D from "@storybook/addon-docs/blocks";
import { ArgType } from "@storybook/addons";
import { Meta } from "@storybook/react";
import { background } from "../../core/src";
import { ComponentPage, ComponentPageProps } from "./utils/component";

const argControl = (target: unknown) => {
	if (target === null) {
		return { type: null };
	} else if (Array.isArray(target)) {
		const type = target.length > 4 ? "select" : "radio";
		return { type, options: target };
	} else if (typeof target === "object") {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const options = Object.keys(target as any);
		const type = options.length > 4 ? "select" : "radio";
		return { type, options };
	} else {
		return { type: target };
	}
};

const arg = (target: unknown, category?: string): ArgType => {
	const table = category ? { category } : undefined;
	const control = argControl(target);
	// https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-controloptions
	const options = control.options;
	delete control.options;
	return { options, control, table };
};

// eslint-disable-next-line
const desc = (story: any) => (text: string): void => {
	story.parameters ??= {};
	story.parameters.docs ??= {};
	story.parameters.docs.description ??= {};
	story.parameters.docs.description.story = text;
};

// eslint-disable-next-line
const expanded = (story: any): void => {
	story.parameters ??= {};
	story.parameters.docs ??= {};
	story.parameters.docs.source ??= {};
	story.parameters.docs.source.state = "open";
	story.parameters.docs.source.withSource = "open";
	story.parameters.docs.source.isExpanded = true;
};

// eslint-disable-next-line
const fixPrimary = (story: any): void => {
	story.parameters ??= {};
	story.parameters.docs ??= {};
	story.parameters.docs.source ??= {};
	story.parameters.docs.source.type = "code";
};

// eslint-disable-next-line
const name = (story: any, text: string): void => {
	story.storyName = text;
};

const PageNoPrimary = (): JSX.Element => (
	<>
		<D.Title />
		<D.Description />
		<D.Stories />
	</>
);

const PageStickyPrimary = (): JSX.Element => (
	<>
		<D.Title />
		<D.Subtitle />
		<D.Description />
		<div className="moai-hero">
			<div className={["moai-primary", background.strong].join(" ")}>
				<D.Primary />
			</div>
			<div className="moai-table">
				<D.ArgsTable story={D.PRIMARY_STORY} />
			</div>
		</div>
		<D.Stories />
	</>
);

const useComponentPage = (meta: Meta, props: ComponentPageProps): void => {
	meta.parameters ??= {};
	meta.parameters.docs ??= {};
	meta.parameters.docs.page = () => <ComponentPage {...props} />;
};

/**
 * Utilities to work with Storybook
 */
export const Utils = {
	/**
	 * Try to generate the suitable controls for passed "target"
	 */
	arg,
	/**
	 * Add Markdown-based description for the story. This will be rendered
	 * above the story's canvas.
	 */
	desc,
	/**
	 * Storybook Docs plugin has a "smart" feature that will dynamically
	 * "correct" our source code for a story if it uses the story Args. This
	 * usually happens with the Primary story. However, the feature is not
	 * really smart and often drop necessary code. This function fixes the
	 * behavior by forcing the use of our raw source code.
	 *
	 * See the "docs.source.type" section on [DocsPage][1].
	 *
	 * [1]: https://storybook.js.org/docs/react/writing-docs/doc-blocks#docspage-1
	 */
	fixPrimary,
	/**
	 * Show code by default
	 */
	expanded,
	/**
	 * Override the story's name
	 */
	name,
	page: {
		/**
		 * Make the Primary story sticky so the user can see effects of
		 * controls in the ArgsTable
		 */
		stickyPrimary: PageStickyPrimary,
		/**
		 * Skip the rendering of Primary (and its ArgsTable). Useful for
		 * Pattern pages
		 */
		noPrimary: PageNoPrimary,
		/**
		 * Page layout for component doc
		 */
		component: useComponentPage,
	},
};
