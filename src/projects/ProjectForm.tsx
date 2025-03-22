import { Button, Checkbox, Form, Input, InputNumber } from "antd";
import { Project } from "./Project";

interface ProjectFormProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

function ProjectForm (props: ProjectFormProps) {
  const { project, onSave, onCancel } = props
  const [form] = Form.useForm();
  const handleSave = (values: object) => {
    if (!form.isFieldsTouched()) {
      onCancel()
      return
    }

    const editedProject = new Project({ ...project, ...values })
    onSave(editedProject)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={project}
      onFinish={handleSave}
    >
      <Form.Item<Project>
        name="name"
        label="Project Name"
        required
        tooltip="This is a required field">
        <Input placeholder="input Project Name" />
      </Form.Item>
      <Form.Item<Project>
        name="description"
        label="Project Description"
      >
        <Input placeholder="input Project Description" />
      </Form.Item>
      <Form.Item<Project>
        name="budget"
        label="Project Budget"
      >
        <InputNumber placeholder="input Project Budget" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item<Project>
        name="isActive"
        label="Active?"
        valuePropName="checked"
      >
        <Checkbox></Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Save</Button> <Button type="default" onClick={handleCancel}>Cancel</Button>
      </Form.Item>
    </Form>
  )
}

export default ProjectForm