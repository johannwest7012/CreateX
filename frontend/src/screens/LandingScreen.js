import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button, Image } from 'react-bootstrap'
import Creator from '../components/Creator'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CoverPic from '../components/CoverPic'
import CreatorGrid from '../components/CreatorGrid'
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

// import { listCreators } from '../actions/creatorActions'

function LandingScreen() {
    
   

    

    return (

        <div style={{ minHeight: 400, width: '100%' }}>
            <CoverPic/>
            <Row style={{margin: '20px', marginTop: '20px'}}>
                
                <h3>Top Creators</h3>
        
            </Row>
            <CreatorGrid></CreatorGrid>
        </div>
        
       
        
    )
}

export default LandingScreen