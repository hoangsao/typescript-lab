import { fetchApi } from '../../api/ApiCommon'
import { ApiResponsePaging } from '../../api/ApiResponsePaging'
import { Project } from './Project'

const projectApiUrl = `${import.meta.env.VITE_API_URL}/api/projects`;

export const ProjectApi = {
  getAll: () => fetchApi<Project[]>(projectApiUrl),
  getProjectPaging: async (page: number, limit: number) => {
    const pickHeaders = ['x-total-count']
    const response = await fetchApi<Project[]>(`${projectApiUrl}?_page=${page}&_limit=${limit}`, undefined, pickHeaders) as ApiResponsePaging<Project[]>
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
  getProject: (id: number) => fetchApi<Project>(`${projectApiUrl}/${id}`),
  createProject: (project: Project) => fetchApi<Project>(projectApiUrl, {
    method: 'POST',
    body: JSON.stringify(project),
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  updateProject: (id: number, project: Project) => fetchApi<Project>(`${projectApiUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  deleteProject: (id: number) => fetchApi<null>(`${projectApiUrl}/${id}`, {
    method: 'DELETE',
  }),
}
