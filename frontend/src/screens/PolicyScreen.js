import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import Share from '../components/Share'
import Loader from '../components/Loader'
import Message from '../components/Message'

import history from '../history'

function PolicyScreen() {

    return (
        <Container>
      
            <br></br>
            <h1>Policy</h1>
            <h2>Terms and Conditions</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget mauris quis lorem fringilla auctor. Suspendisse mollis ipsum quis mi lobortis, sed aliquam nulla iaculis.</p>
     
        </Container>
    )
}


export default PolicyScreen