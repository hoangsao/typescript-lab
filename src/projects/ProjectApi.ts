import { fetchApi } from '../api/ApiCommon'
import { ApiResponsePaging } from '../api/ApiResponsePaging'
import { Project } from './Project'

const projectUrl = 'http://localhost:5101/api/projects'

export const ProjectApi = {
  getAll: () => fetchApi<Project[]>(projectUrl),
  // getProjectPaging: (page: number, limit: number) => fetchApi<ProjectPaging>(`${projectUrl}?_page=${page}&_limit=${limit}`),
  getProjectPaging: async (page: number, limit: number) => {
    const pickHeaders = ['x-total-count']
    const response = await fetchApi<Project[]>(`${projectUrl}?_page=${page}&_limit=${limit}`, undefined, pickHeaders) as ApiResponsePaging<Project[]>
    if (response.ok) {
      response.pageNumber = page
      response.pageSize = limit
      const totalCount = response.headers['x-total-count']
      if (totalCount && Number.isFinite(Number(totalCount))) {
        response.totalCount = Number(totalCount)
      }
      else {
        response.totalCount = 0
      }
    }
    return response
  },
  getProject: (id: number) => fetchApi<Project>(`${projectUrl}/${id}`),
  createProject: (project: Project) => fetchApi<Project>(projectUrl, {
    method: 'POST',
    body: JSON.stringify(project),
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  updateProject: (id: number, project: Project) => fetchApi<Project>(`${projectUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  deleteProject: (id: number) => fetchApi<null>(`${projectUrl}/${id}`, {
    method: 'DELETE',
  }),
}
