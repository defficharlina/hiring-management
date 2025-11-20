import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { CategoryList as CategoryListComponent } from '../../components'
import { Category, GetCategoryResponse } from '../../types';
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {

    const [categorys, setCategorys] = useState<Category[]>([]);
    const navigate = useNavigate();


    const token = localStorage.getItem('authToken')
    console.log("Auth Token:", token)

    const getCategoryList = async () => {
        const fetching = await fetch('https://mock-api.arikmpt.com/api/category', {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const response: GetCategoryResponse = await fetching.json();
        
        console.log("API Response:", response); // Tambahkan ini untuk melihat respons API di konsol
        
        setCategorys(response.data ?? []);
    };

    useEffect(
        () => {
            getCategoryList()
        },
        []
    )

    const removeCategory = async (id_vehicle: number) => {
        try {
            const fetching = await fetch(`https://mock-api.arikmpt.com/api/category/${id_vehicle}`, 
            {
                method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

            //const response = await fetching.json()

            //if(response) {
                //cara pertama panggil api lagi
                // getProductList()

                //cara kedua
                //setCategorys((categorys) => categorys.filter((category) => category.id !== id))
            //}

            if (fetching.ok) {
                // Check if the request was successful (status code 204 No Content)
                setCategorys((categorys) =>
                  categorys.filter((category) => category.id_vehicle !== id_vehicle)
                );
              }
        } catch (error) {
            alert(error);
        }
    };

    const columns: ColumnsType<Category> = [
        {
            title: 'ID Vehicle',
            dataIndex: 'id',
            key: 'id',        
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',        
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',        
        },
        {
            title: 'Colour',
            dataIndex: 'colour',
            key: 'colour',        
        },
        {
            title: 'Fuel',
            dataIndex: 'fuel',
            key: 'fuel',        
        },
        {
            title: 'Chassis',
            dataIndex: 'chassis',
            key: 'chassis',        
        },
        {
            title: 'Engine Number',
            dataIndex: 'engine_no',
            key: 'engine_no',        
        },
        {
            title: 'Date Registration',
            dataIndex: 'date_reg',
            key: 'date_reg',        
        },
        {
            title: 'Curency',
            dataIndex: 'curr',
            key: 'curr',        
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',        
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <>
                {/*<Button type={'default'} onClick={() => navigate(`/category/${record.id}`)}>Detail</Button>*/}
                <Button type={'primary'} onClick={() => navigate(`/category/edit/${record.id_vehicle}`)}>Edit</Button>
                <Button type={'primary'} onClick={() => removeCategory(record.id_vehicle) } style={{ marginLeft: "5px" }}>Delete</Button>
              </>
            ),
        },
    ];

    return (
        <>
            <h3>Daftar Vehicle</h3>
            <Button type={'primary'} onClick={() => navigate('/category/new')}>Tambah Vehicle Baru</Button>
            {/*<Button type={'primary'} onClick={() => navigate('/logout')}>Logout</Button>*/}
            {/*<Button type={'primary'} onClick={handleLogOut} danger>Log Out</Button>*/}
            <CategoryListComponent columns={columns} data={categorys}/>
        </>
    )
}

export default CategoryList