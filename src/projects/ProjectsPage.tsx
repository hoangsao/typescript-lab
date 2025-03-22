import { Col, Pagination, Row, Spin } from 'antd';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import { Project } from './Project';
import { useEffect, useState } from 'react';
import { ProjectApi } from './ProjectApi';

function ProjectsPage () {
  const [editingProject, setEditingProject] = useState<Project>()
  const [loading, setLoading] = useState<boolean>(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentPageSize, setCurrentPageSize] = useState<number>(8)
  const [totalCount, setTotalCount] = useState<number>(0)

  const handleEdit = (project: Project) => {
    setEditingProject(project)
  }

  const handleDelete = async (project: Project) => {
    if (!project.id) {
      return
    }

    const response = await ProjectApi.deleteProject(project.id)
    if (response.ok) {
      getProjectPaging(currentPage, currentPageSize)
    }
    else {
      console.error(response.error)
    }
  }

  const handleSave = async (editedProject: Project) => {
    if (editedProject.id) {
      const response = await ProjectApi.updateProject(editedProject.id, editedProject)
      if (response.ok) {
        await getProjectPaging(currentPage, currentPageSize)
      }
      else {
        console.error(response.error)
      }
    }

    setEditingProject(undefined)
  }

  const handleCancel = () => {
    setEditingProject(undefined)
  }

  const getProjectPaging = async (page: number, perPage: number) => {
    setLoading(true)
    const response = await ProjectApi.getProjectPaging(page, perPage)
    if (response.ok) {
      setProjects(response.data ?? [])
      setCurrentPage(page)
      setCurrentPageSize(perPage)
      setTotalCount(response.totalCount)
    }
    else {
      console.error(response.error)
    }

    setLoading(false)
  }

  const onChangeProjectPaging = (page: number, pageSize: number) => {
    getProjectPaging(page, pageSize)
  }

  useEffect(() => {
    getProjectPaging(1, 8)
  }, [])

  return (
    <div>
      <h1>Projects</h1>
      <Spin spinning={loading} tip="Loading" size="large">
        <Row gutter={[16, 16]}>
          {projects?.map((project) => (
            <Col key={project.id} span={6}>
              {
                editingProject === project ?
                  <ProjectForm project={project} onSave={handleSave} onCancel={handleCancel} /> :
                  <ProjectCard project={project} onEdit={handleEdit} onDelete={handleDelete} />
              }
            </Col>
          ))}
        </Row>
        <Pagination align="end" defaultPageSize={8} current={currentPage} onChange={onChangeProjectPaging} total={totalCount} />
      </Spin>
    </div>
  );
}

export default ProjectsPage;