import { fetchApi } from "../../api/ApiCommon"
import { ApiResponse } from "../../api/ApiResponse"
import { Photo } from "./Photo"

const photoUrl = 'http://localhost:5101/photos'

const getAll = async (): Promise<ApiResponse<Photo[]>> => {
  return await fetchApi<Photo[]>(photoUrl)
}

const getPage = async (page = 1, limit = 100): Promise<ApiResponse<Photo[]>> => {
  return await fetchApi<Photo[]>(`${photoUrl}?_page=${page}&_limit=${limit}`)
}

const getPhoto = async (id: number): Promise<ApiResponse<Photo>> => {
  return await fetchApi<Photo>(`${photoUrl}/${id}`)
}

const createPhoto = async (photo: Photo): Promise<ApiResponse<Photo>> => {
  return await fetchApi<Photo>(photoUrl, {
    method: 'POST',
    body: JSON.stringify(photo),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const updatePhoto = async (photo: Photo): Promise<ApiResponse<Photo>> => {
  return await fetchApi<Photo>(`${photoUrl}/${photo.id}`, {
    method: 'PUT',
    body: JSON.stringify(photo),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const deletePhoto = async (photo: Photo): Promise<ApiResponse<Photo>> => {
  return await fetchApi<Photo>(`${photoUrl}/${photo.id}`, {
    method: 'DELETE'
  })
}

export const PhotoApi = {
  getAll,
  getPage,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto
}