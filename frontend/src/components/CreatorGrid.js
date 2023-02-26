import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button, Image } from 'react-bootstrap'



function CreatorGrid() { 
    const columns = [
        { field: 'id', 
          headerName: 'Rank', 
          width: 90 
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
            type: 'numebr',
            valueFormatter: ({ value }) => {
              if (value === null) {
                return '';
              }
              return `$${value.toFixed(2)}`;
            },
            width: 150,
            editable: false,
            headerAlign: 'left',
            align: 'left'
          },
      ];
      
      const rows = [
        { id: 1, lastName: '', firstName: 'Cody Ko', price: 35.00 },
        { id: 2, lastName: '', firstName: 'Mr. Beast', price: 42.00 },
        { id: 3, lastName: '', firstName: 'PewDiePie', price: 45.00 },
        { id: 4, lastName: '', firstName: 'Taylor Swift', price: 16.00 },
        { id: 5, lastName: '', firstName: 'Dude Perfect', price: 10.00 },
        { id: 6, lastName: '', firstName: null, price: 150.00 },
        { id: 7, lastName: '', firstName: 'Ferrara', price: 44.00 },
        { id: 8, lastName: '', firstName: 'Rossini', price: 36.00 },
        { id: 9, lastName: '', firstName: 'Harvey', price: 65.00 },
      ];
    return (
        <div style={{ minHeight: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            pagination={false}
            autoHeight
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
        />
        </div>
    )

}
export default CreatorGrid