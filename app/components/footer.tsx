import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';

const styles = stylex.create({
	footer: {
		position: 'relative',
	},
	container: {
		padding: '1rem',
	},
});

export default function Footer({ ...props }: ComponentProps<'footer'>) {
	return (
		<footer {...props} {...stylex.props(styles.footer)}>
			<div {...stylex.props(styles.container)}>
				<p>{new Date().toLocaleDateString()}</p>
			</div>
		</footer>
	);
}
