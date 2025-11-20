import { useState } from "react"
import { LoginForm as LoginFormProps } from "../../types"
import { LoginForm } from "../../components"
import { authService } from "../../services/authService"
import { message } from "antd"

const Login = () => {
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: LoginFormProps) => {
        setLoading(true)
        
        try {
            // Login menggunakan Supabase
            const result = await authService.login({
                email: data.username,
                password: data.password
            })

            // Simpan data ke localStorage
            localStorage.setItem('token', result.session?.access_token || '')
            localStorage.setItem('userRole', result.role)
            localStorage.setItem('username', result.user?.email || '')
            
            console.log("Login berhasil:", result.role)
            message.success(`Welcome ${result.fullName || result.user?.email}!`)
            
            // Redirect berdasarkan role
            if (result.role === 'admin') {
                window.location.replace("/admin/jobs")
            } else {
                window.location.replace("/jobs")
            }
        } catch (error: any) {
            console.error('Login error:', error)
            
            // Handle specific error messages
            if (error.message?.includes('Invalid login credentials')) {
                message.error('Email atau password salah!')
            } else if (error.message?.includes('Email not confirmed')) {
                message.error('Silakan konfirmasi email Anda terlebih dahulu')
            } else {
                message.error('Login gagal. Silakan coba lagi.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <LoginForm onSubmit={onSubmit}/>
    )
}

export default Login