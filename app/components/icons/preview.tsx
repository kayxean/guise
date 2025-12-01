import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';

const styles = stylex.create({
	layout: {
		padding: '0 0.875rem',
	},
	preview: {
		display: 'grid',
		gap: '2rem',
		margin: '0 auto',
		maxWidth: '64em',
	},
	section: {
		display: 'inline-grid',
	},
	list: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '2rem 1rem',
		listStyle: 'none',
		justifyContent: 'flex-start',
		marginTop: '2rem',
	},
	item: {
		alignItems: 'center',
		display: 'inline-flex',
		flexDirection: 'column',
		minWidth: '8rem',
		width: '12%',
	},
	icon: {
		color: '#f2f3f4',
	},
	text: {
		fontSize: '0.875rem',
		textAlign: 'center',
	},
});

export function Preview({ children, ...props }: ComponentProps<'div'>) {
	return (
		<div {...stylex.props(styles.layout)}>
			<div {...stylex.props(styles.preview)} {...props}>
				{children}
			</div>
		</div>
	);
}

export function Section({ children, ...props }: ComponentProps<'section'>) {
	return (
		<section {...stylex.props(styles.section)} {...props}>
			{children}
		</section>
	);
}

export function List({ children, ...props }: ComponentProps<'ul'>) {
	return (
		<ul {...stylex.props(styles.list)} {...props}>
			{children}
		</ul>
	);
}

export function Item({
	children,
	icon,
	...props
}: ComponentProps<'li'> & { icon: string }) {
	return (
		<li {...stylex.props(styles.item)} {...props}>
			<div {...stylex.props(styles.icon)}>{children}</div>
			<p {...stylex.props(styles.text)}>{icon}</p>
		</li>
	);
}
