import { Button, Card, Popconfirm } from "antd";
import { Project } from "./Project";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Meta } = Card;

function formatDescription (description: string | undefined): string {
  if (!description) {
    return ''
  }

  return description.substring(0, 60) + '...';
}

interface ProjectCardProps {
  project: Project,
  onEdit: (editingProject: Project) => void
  onDelete: (project: Project) => void
}

function ProjectCard (props: ProjectCardProps) {
  const { project, onEdit, onDelete } = props

  const handleEditClick = (editingProject: Project) => {
    onEdit(editingProject)
  }

  const handleDeleteClick = (project: Project) => {
    onDelete(project)
  }

  return (
    <Card
      // style={{ width: 300 }}
      cover={
        <img
          alt={project.name}
          src={project.imageUrl}
        />
      }
      actions={[
        <EditOutlined key="edit" onClick={() => { handleEditClick(project) }} />,
        <Popconfirm
          key="delete"
          title="Delete the project"
          description="Are you sure to delete this project?"
          onConfirm={() => { handleDeleteClick(project) }}
        >
          <DeleteOutlined key="delete" />
        </Popconfirm>
      ]}
    >
      <Meta
        title={project.name}
        description={formatDescription(project.description)}
      />
      <p>Budget: ${project.budget.toLocaleString()}</p>
      {/* <Button type="primary" icon={<EditOutlined />} onClick={() => { handleEditClick(project) }}>
        Edit
      </Button> */}
    </Card>
  )
}

export default ProjectCard