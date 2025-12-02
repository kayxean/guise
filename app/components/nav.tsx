import { Link } from '@remix-run/react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
	layout: {
		display: 'grid',
		padding: '0 0.875rem',
	},
	nav: {
		display: 'inline-grid',
		margin: '0 auto',
		maxWidth: '90em',
		width: '100%',
	},
	list: {
		alignItems: 'center',
		display: 'flex',
		flexWrap: 'wrap',
		gap: '1rem',
		height: '3em',
		listStyle: 'none',
	},
	item: {
		display: 'inline-flex',
	},
	link: {
		color: '#c2c3c4',
		fontSize: '0.875rem',
		textDecoration: 'none',
	},
});

type Route = {
	name: string;
	path: string;
};

export default function Navigation({ routes }: { routes: Route[] }) {
	return (
		<div {...stylex.props(styles.layout)}>
			<nav {...stylex.props(styles.nav)}>
				<ul {...stylex.props(styles.list)}>
					{routes.map((route) => (
						<li key={route.name} {...stylex.props(styles.item)}>
							<Link to={route.path} {...stylex.props(styles.link)}>
								{route.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
