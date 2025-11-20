import * as yup from 'yup'

export const initialValues = {
    username: '',
    password: ''
}

export const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Please Enter Your Password")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Use at least 8 characters, one uppercase letter, one lowercase letter, and one number"
      )
})