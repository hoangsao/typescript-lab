// import { useState } from 'react'
import ProjectsPage from './projects/ProjectsPage'
import './App.css'
// import Hello from './projects/Hello'
import PhotosPage from './photos/PhotosPage'
import { Layout } from 'antd'
const { Header, Content, Footer } = Layout

function App () {

  return (
    <Layout>
      <Header>header</Header>
      <Layout>
        <Content style={{ padding: '0 20px' }}>
          <ProjectsPage />
        </Content>
      </Layout>
    </Layout>
    // <div className='container'>
    //   <ProjectsPage />
    // </div>
  )
}

export default App
