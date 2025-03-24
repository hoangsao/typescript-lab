import { useState } from 'react';
import { ContainerOutlined, CustomerServiceOutlined, HomeOutlined, OrderedListOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { routePaths } from '../constants/constants';
import { AuthApi } from '../api/auth/AuthApi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Home',
    key: routePaths.home,
    icon: <HomeOutlined />,
  },
  {
    label: 'Products',
    key: routePaths.projects,
    icon: <CustomerServiceOutlined />,
  },
  {
    label: 'Posts',
    key: 'posts',
    icon: <SolutionOutlined />,
  },
  {
    label: 'Users',
    key: 'users',
    icon: <UserOutlined />,
  },
  {
    label: 'Todos',
    key: 'todos',
    icon: <OrderedListOutlined />,
  },
  {
    label: 'Recipes',
    key: 'recipes',
    icon: <ContainerOutlined />,
  },
]

const TopNav = () => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(routePaths.home)
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    const response = await AuthApi.logout()
    if (response.ok) {
      logout()
      navigate('/login', { replace: true, state: { isLogedOut: true } })
    }
  }

  const onLeftNavClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  const onRightNavClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    if (e.key === 'logout') {
      handleLogout()
    }
  }

  const renderLeftNav = () => {
    return <Menu className='left-nav' onClick={onLeftNavClick} selectedKeys={[current]} mode="horizontal" items={items} />
  }

  const renderRightNav = () => {
    if (!user) {
      return
    }

    const rightNavItems: MenuItem[] = [
      {
        key: 'profile-group',
        icon: user.image ? <img className='user-image' src={user.image} /> : <UserOutlined />,
        label: `${user.firstName} ${user.lastName}`,
        children: [
          {
            key: 'profile',
            label: 'Profile',
          },
          {
            type: 'divider',
          },
          {
            key: 'logout',
            label: 'Logout',
          },
        ],
      }
    ]

    return <Menu className='right-nav' onClick={onRightNavClick} mode="horizontal" items={rightNavItems} selectable={false} />
  }

  return <>
    {renderLeftNav()}
    {renderRightNav()}
  </>
}

export default TopNav