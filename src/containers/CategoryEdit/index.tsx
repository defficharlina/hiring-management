import { CategoryForm } from "../../components"
import { CategoryForm as CategoryFormProps, Category } from "../../types"
import { useNavigate, useParams } from "react-router-dom"
import { useCallback, useEffect, useState } from "react";

const CategoryEdit = () => {

    const navigate = useNavigate();
    const [category, setCategory] = useState<Category>()

    const { id } = useParams();

    const token = localStorage.getItem('authToken')
    console.log("Auth Token:", token)

    const getCategory = useCallback(
        async () => {
            const fetching = await fetch(`https://mock-api.arikmpt.com/api/category/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
            const response: Category = await fetching.json();

            console.log("API Response:", response); // Tambahkan ini untuk melihat respons API di konsol
    
            setCategory(response)
        },
        [id, token]
    )

    useEffect(
        () => {
            getCategory()
        },
        [getCategory]
    )

    const onSubmit = async (values: CategoryFormProps) => {
        try {
            const fetching = await fetch(`https://mock-api.arikmpt.com/api/category/update`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...values, id: id }),
            })
            if (fetching.ok) {
                navigate('/category')
            } else {
                console.log("Failed to update category")
            }
        } catch (error) {
            alert(error)
        }
    }

    if(category) {
        return <CategoryForm onSubmit={onSubmit} category={category}/>
    }

    return null
}

export default CategoryEdit