import type { MetaFunction } from '@remix-run/node';
import * as Icon from '~/components/icons/material';
import { Item, List, Preview, Section } from '~/components/icons/preview';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Guise: Icons' },
		{ name: 'description', content: 'icons preview' },
		{ tagName: 'link', rel: 'canonical', href: '/icons' },
	];
};

export default function Icons() {
	return (
		<Preview>
			<Section>
				<h1>Icons</h1>
				<p>
					Icons are a visual representation of an object or action. They can be
					used to represent objects, actions, or ideas. Icons are used in a
					variety of applications, including web applications, mobile
					applications, and desktop applications.
				</p>
				<List>
					<Item icon="Guise Logo">
						<Icon.GuiseLogo />
					</Item>
					<Item icon="Pane">
						<Icon.Pane />
					</Item>
				</List>
			</Section>
			<Section>
				<h2>Material Icons</h2>
				<p>
					A set of icons designed by Google that are licensed under the Apache
					License version 2.0.
				</p>
				<List>
					<Item icon="Chrome">
						<Icon.Chrome />
					</Item>
					<Item icon="Search">
						<Icon.Search />
					</Item>
					<Item icon="Microphone">
						<Icon.Mic />
					</Item>
					<Item icon="Camera">
						<Icon.Camera />
					</Item>
					<Item icon="Search Spark">
						<Icon.SearchSpark />
					</Item>
					<Item icon="Search Labs">
						<Icon.SearchLabs />
					</Item>
					<Item icon="Apps">
						<Icon.Apps />
					</Item>
					<Item icon="Google">
						<Icon.Google />
					</Item>
					<Item icon="Page Info">
						<Icon.PageInfo />
					</Item>
					<Item icon="Grid View">
						<Icon.GridView />
					</Item>
					<Item icon="Folder">
						<Icon.Folder />
					</Item>
					<Item icon="Star">
						<Icon.Star />
					</Item>
					<Item icon="Install Desktop">
						<Icon.InstallDesktop />
					</Item>
					<Item icon="More Vertical">
						<Icon.MoreVert />
					</Item>
					<Item icon="Account Circle">
						<Icon.AccountCircle />
					</Item>
					<Item icon="Queue Music">
						<Icon.QueueMusic />
					</Item>
					<Item icon="Arrow Down">
						<Icon.ArrowDown />
					</Item>
					<Item icon="Arrow Back">
						<Icon.ArrowBack />
					</Item>
					<Item icon="Refresh">
						<Icon.Refresh />
					</Item>
					<Item icon="Close">
						<Icon.Close />
					</Item>
					<Item icon="Add">
						<Icon.Add />
					</Item>
					<Item icon="Globe">
						<Icon.Globe />
					</Item>
					<Item icon="File">
						<Icon.File />
					</Item>
					<Item icon="Data Array">
						<Icon.DataArray />
					</Item>
					<Item icon="Data Object">
						<Icon.DataObject />
					</Item>
				</List>
			</Section>
		</Preview>
	);
}
