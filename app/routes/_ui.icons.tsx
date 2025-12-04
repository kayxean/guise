import type { MetaFunction } from '@remix-run/node';
import { Article } from '~/components/article';
import { Item, List } from '~/components/icons';
import * as Icon from '~/icons/material';

export const meta: MetaFunction = () => {
  return [
    { title: 'Icons' },
    { name: 'description', content: 'guise' },
    { tagName: 'link', rel: 'canonical', href: '/icons' },
  ];
};

export default function Icons() {
  return (
    <Article>
      <header>
        <h1>Icons are a visual representation of an object or action.</h1>
        <h2>They can be used to represent objects, actions, or ideas.</h2>
        <p>
          Icons are used in a variety of applications, including web
          applications, mobile applications, and desktop applications.
        </p>
      </header>
      <List>
        <Item name="Guise Logo">
          <Icon.GuiseLogo />
        </Item>
        <Item name="Pane">
          <Icon.Pane />
        </Item>
        <Item name="Menu">
          <Icon.Menu />
        </Item>
      </List>
      <h2>Material Icons</h2>
      <p>
        A set of icons designed by Google that are licensed under the Apache
        License version 2.0.
      </p>
      <List>
        <Item name="Chrome">
          <Icon.Chrome />
        </Item>
        <Item name="Search">
          <Icon.Search />
        </Item>
        <Item name="Microphone">
          <Icon.Mic />
        </Item>
        <Item name="Camera">
          <Icon.Camera />
        </Item>
        <Item name="Search Spark">
          <Icon.SearchSpark />
        </Item>
        <Item name="Search Labs">
          <Icon.SearchLabs />
        </Item>
        <Item name="Apps">
          <Icon.Apps />
        </Item>
        <Item name="Google">
          <Icon.Google />
        </Item>
        <Item name="Page Info">
          <Icon.PageInfo />
        </Item>
        <Item name="Grid View">
          <Icon.GridView />
        </Item>
        <Item name="Folder">
          <Icon.Folder />
        </Item>
        <Item name="Star">
          <Icon.Star />
        </Item>
        <Item name="Install Desktop">
          <Icon.InstallDesktop />
        </Item>
        <Item name="More Vertical">
          <Icon.MoreVert />
        </Item>
        <Item name="Account Circle">
          <Icon.AccountCircle />
        </Item>
        <Item name="Queue Music">
          <Icon.QueueMusic />
        </Item>
        <Item name="Arrow Down">
          <Icon.ArrowDown />
        </Item>
        <Item name="Arrow Back">
          <Icon.ArrowBack />
        </Item>
        <Item name="Refresh">
          <Icon.Refresh />
        </Item>
        <Item name="Close">
          <Icon.Close />
        </Item>
        <Item name="Add">
          <Icon.Add />
        </Item>
        <Item name="Globe">
          <Icon.Globe />
        </Item>
        <Item name="File">
          <Icon.File />
        </Item>
        <Item name="Data Array">
          <Icon.DataArray />
        </Item>
        <Item name="Data Object">
          <Icon.DataObject />
        </Item>
      </List>
    </Article>
  );
}
