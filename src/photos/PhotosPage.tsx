import { Card, Col, Row, Spin } from "antd"
import { useEffect, useState } from "react"
import { Photo } from "../api/Photo"
import { PhotoApi } from "../api/PhotoApi"

import './PhotosPage.scss'

const { Meta } = Card

const PhotosPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [photos, setPhotos] = useState<Photo[]>([])

  const getAllPhotos = async () => {
    setLoading(true)
    const response = await PhotoApi.getAll()
    if (response.ok) {
      setPhotos(response.data ?? [])
    }
    else {
      console.error(response.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllPhotos()
  }, [])

  return <div className="photos-page-container">
    <Spin spinning={loading} tip="Loading" size="large" className="spinner">
      <Row gutter={16}>
        {photos.map(photo => (
          <Col key={photo.id} span={4}>
            <Card
              key={photo.id}
              hoverable
              style={{ width: 240, margin: 16 }}
              cover={<img alt={`${photo.title}`} src={photo.thumbnailUrl} />}
            >
              <Meta title={photo.title} description={photo.url} />
            </Card>
          </Col>
        ))}
      </Row>
    </Spin>
  </div>
}

export default PhotosPage