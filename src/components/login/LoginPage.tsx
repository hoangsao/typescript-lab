import { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message, Spin } from 'antd';
import './LoginPage.scss';
import { AuthApi } from '../../api/auth/AuthApi';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../constants/constants';
import { useAuthStore } from '../../store/authStore';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    if (!values.username || !values.password) {
      return
    }

    setLoading(true)
    const response = await AuthApi.login(values.username, values.password)
    if (response.ok) {
      if (response.data) {
        login(response.data)
      }

      messageApi.open({
        type: 'success',
        content: 'Login successful',
      })
      navigate(routePaths.home, { replace: true, state: { isAuthorized: true } })
    }
    else {
      messageApi.open({
        type: 'error',
        content: 'Incorrect username or password. Please try again.',
      })
      setLoading(false)
    }
  };

  return <>
    {contextHolder}
    <div className='login-container'>
      <Spin spinning={loading} size="large">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  </>
}

export default LoginPage