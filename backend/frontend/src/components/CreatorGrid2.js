import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button, Image} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { listCreators } from '../actions/creatorActions.js'
import history from '../history'



function CreatorGrid2() { 
    const columns = [
        { field: 'id', 
          headerName: 'Id', 
          width: 90 
        },
        {
          field: 'image',
          headerName: 'Profile',
          width: 100,
          renderCell: (params) => (
            <Link to={`/creator/${params.row.id}`}>
            <Image src={params.value} alt="product" style={{ width: '60%', borderRadius: '50%' }} />
            </Link>
          ),
        },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            valueFormatter: ({ value }) => {
              if (value === null) {
                return '';
              }
              //return `$${value.toFixed(2)}`;
              return value;
            },
            width: 150,
            editable: false,
            headerAlign: 'left',
            align: 'left'
          },
      ];

    // Get creator data 
    const dispatch = useDispatch()
    const creatorList = useSelector(state => state.creatorList)
    const {error, loading, creators} = creatorList


    useEffect(()=> {
        dispatch(listCreators())
        
    }, [dispatch])

    const data_rows = []

    for (let i = 0; i < creators.length; i++) {
      data_rows.push({ id: creators[i]._id, lastName: '', firstName: creators[i].name, price: creators[i].price, image: creators[i].image})
    }


    const rows = [
      { id: 1, lastName: '', firstName: 'Cody Ko', price: 45.00, image: '/logo192.png'},
      { id: 2, lastName: '', firstName: 'Mr. Beast', price: 42.00, image: '/logo192.png' },
      { id: 3, lastName: '', firstName: 'PewDiePie', price: 38.00, image: '/logo192.png' },
      { id: 4, lastName: '', firstName: 'KSI', price: 25.00, image: '/logo192.png' },
      { id: 5, lastName: '', firstName: 'Logan Paul', price: 23.00 },
      { id: 6, lastName: '', firstName: null, price: 17.00 },
      { id: 7, lastName: '', firstName: 'Emma Chamberlain', price: 44.00 },
      { id: 8, lastName: '', firstName: 'Rossini', price: 36.00 },
      { id: 9, lastName: '', firstName: 'Harvey', price: 65.00 },
    ];

    
    
    return (
        <div style={{ minHeight: 400, width: '100%', marginTop: '20px', marginBottom: '20px'}}>
        <DataGrid
            rows={data_rows}
            columns={columns}
            pageSize={5}
            autoHeight
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            className="rounded-0"
        />
        </div>
    )

}
export default CreatorGrid2