import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

// posts, albums, users, todos
const items: MenuItem[] = [
  {
    label: 'Posts',
    key: 'posts',
    icon: <MailOutlined />,
  },
  {
    label: 'Albums',
    key: 'albums',
    icon: <AppstoreOutlined />,
    disabled: true,
  }, {
    label: 'Users',
    key: 'users',
    icon: <AppstoreOutlined />,
    disabled: true,
  }, {
    label: 'Todos',
    key: 'todos',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
]

const App: React.FC = () => {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default App;