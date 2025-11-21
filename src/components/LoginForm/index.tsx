import { Button, Input, Typography } from "antd"
import { useFormik } from "formik"
import { LoginForm as LoginFormProps } from "../../types"
import { initialValues, validationSchema } from "./loginFormSchema"
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import './LoginForm.css'

interface Props {
    onSubmit: (values: LoginFormProps) => void
}

const LoginForm = ({ onSubmit } : Props) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (values: LoginFormProps) => {
        onSubmit(values)
    }

    const formMik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: validationSchema
    })

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo-content">
                        <div className="login-logo-icon">
                            {'</>'}
                        </div>
                        <div>
                            <div className="login-logo-text-main">
                                Job Portal
                            </div>
                            <div className="login-logo-text-sub">
                                Academy
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="login-card">
                    <Typography.Title level={3} className="login-title">
                        Masuk ke Job Portal
                    </Typography.Title>

                    <form onSubmit={formMik.handleSubmit}>
                        <div className="login-form-item">
                            <Typography.Text className="login-label">
                                Alamat email
                            </Typography.Text>
                            <Input 
                                name={'username'}
                                placeholder="Masukan email"
                                value={formMik.values.username} 
                                onChange={formMik.handleChange('username')}
                                status={formMik.errors.username && 'error'}
                                size="large"
                                className="login-input"
                            />
                            {formMik.errors.username && (
                                <Typography.Text type="danger" className="login-error">
                                    {formMik.errors.username}
                                </Typography.Text>
                            )}
                        </div>

                        <div className="login-form-item">
                            <Typography.Text className="login-label">
                                Kata sandi
                            </Typography.Text>
                            <Input 
                                name={'password'}
                                placeholder="Masukan kata sandi"
                                value={formMik.values.password} 
                                onChange={formMik.handleChange('password')}
                                status={formMik.errors.password && 'error'}
                                type={showPassword ? 'text' : 'password'}
                                size="large"
                                className="login-input"
                                suffix={
                                    <span 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="login-password-toggle"
                                    >
                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    </span>
                                }
                            />
                            {formMik.errors.password && (
                                <Typography.Text type="danger" className="login-error">
                                    {formMik.errors.password}
                                </Typography.Text>
                            )}
                        </div>

                        <Button 
                            type={'primary'} 
                            htmlType="submit"
                            size="large"
                            block
                            className="login-button"
                        >
                            Masuk
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm