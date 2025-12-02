import { Outlet } from '@remix-run/react';
import Navigation from '~/components/nav';

export default function AppLayout() {
	const APP = [
		{ name: 'Guise', path: '/' },
		{ name: 'Create', path: '/create' },
		{ name: 'Color', path: '/color' },
		{ name: 'Theme', path: '/theme' },
		{ name: 'Chromium', path: '/theme/chromium' },
		{ name: 'Zed', path: '/theme/zed' },
	];

	return (
		<div>
			<header>
				<Navigation routes={APP} />
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
