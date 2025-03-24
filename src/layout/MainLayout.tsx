import { memo, ReactNode } from 'react';
import { Layout } from 'antd';
import TopNav from './TopNav';
import './MainLayout.scss'

const { Header, Content, Footer } = Layout

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = memo(({ children }: MainLayoutProps) => {
  return (
    <>
      <Layout className='main-layout-container'>
        <Header className='header-container'>
          <TopNav />
        </Header>
        <Content className='content-container'>
          {children}
        </Content>
        <Footer className='footer-container'>
          © {new Date().getFullYear()} Your App Name. All rights reserved.
        </Footer>
      </Layout>
    </>
  )
})

export default MainLayout