import { Outlet } from '@remix-run/react';
import Navigation from '~/components/nav';

export default function StaticLayout() {
	const STATIC = [
		{ name: 'Guise', path: '/' },
		{ name: 'About', path: '/about' },
		{ name: 'Privacy', path: '/privacy' },
		{ name: 'Terms', path: '/terms' },
	];

	return (
		<div>
			<header>
				<Navigation routes={STATIC} />
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
