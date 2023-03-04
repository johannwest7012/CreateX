import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams} from 'react-router-dom'

import { Row, Col, Image, ListGroup, Button, Card, Form, Container} from 'react-bootstrap'
import { listCreatorDetails } from '../actions/creatorActions'
import { getUserShares } from '../actions/userActions'

import Loader from '../components/Loader'
import Message from '../components/Message'
import LineChart from '../components/LineChart'

import history from '../history'
import { submitUserOrder } from '../actions/userActions'
import { Line } from '@nivo/line'



function CreatorScreen() {


    // this quanitity function applies to BUY or SELL button 
    const [qty, setQty] = useState(1)

    const [message, setMessage] = useState('')


    let params = useParams();

    // handling product details reducer 
    const dispatch = useDispatch()

    const creatorDetails = useSelector(state => state.creatorDetails)
    const { loading, error, creator } = creatorDetails

    const userDetails = useSelector(state => state.userDetails)
    const { user_error, user_loading, user } = userDetails

    const shareList = useSelector(state => state.userShares)
    const {shares_error, shares_loading, shares} = shareList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
 
    useEffect(()=> {
        dispatch(listCreatorDetails(params.id))
    }, [dispatch])

    function addToFavHandler(){
        //console.log('Add to favs:', params.id)

        // history path redirect needs fixing 
        history.push(`/favorites/${params.id}`)
        window.location.reload()
        
    }  
    
    function submitBuyHandler(){
        // in the future this will be much more robust
        // by submitting a buy order to the backend which 
        // will be matched with someone else's sell order 
        
        // disallow if user does not have enough money 
        if (!userInfo) {
            history.push('/login')
            window.location.reload()

        }
        else {
            if (user.balance < creator.price) {
                setMessage('Balance insufficent')
            }
            else{ 
                dispatch(submitUserOrder({
                    'id' : user.id, 
                    'pk' : creator._id,
                    'buy_sell' : 'buy',
                    'price' : creator.price
                }))
                setMessage('')
                history.push('/profile/')
                window.location.reload()

            }
        }
    }

    function submitSellHandler(){

        if (!userInfo) {
            history.push('/login')
            window.location.reload()

        }
        else{ 
            dispatch(getUserShares('shares'))
            let pass = false 
            for (let i = 0; i < shares.length; i++){
                if (creator._id === shares[i].creator && shares[i].in_transit === false) { 
                    pass = true 
                }
            }

            if (pass === true) { 
                dispatch(submitUserOrder({
                    'id' : user.id, 
                    'pk' : creator._id,
                    'buy_sell' : 'sell',
                    'price' : creator.price
                }))
                setMessage('')
                history.push('/profile/')
                window.location.reload()
            }
            else { 
                setMessage('Cannot sell share you do not own')
            }

        }
    }

   
    


    // useEffect(() => {
    //     if(!userInfo){
    //         history.push('/login')
    //     }else{
    //         dispatch(getUserShares('shares'))
    //     }
    // }, [dispatch, history, userInfo])
    




    return (
        <div>
            <Container>
            <Link to='/home' className='btn btn-light my-3'>Go Back</Link>

            {loading ? 
            <Loader/>
                : error ?
                 <Message variant='danger'>{error}</Message>
                : (
                <Row>
                    <Col md={6}>
                        <Image src = {creator.image} alt={creator.name} fluid />
                    </Col>

                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>{creator.name}</h3>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h3>{creator.rating} Rating</h3>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Price: ${(creator.price).slice(0,-1)}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Description: {creator.description}
                            </ListGroup.Item>


                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>${creator.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {creator.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                

                                <ListGroup.Item>

                                    {/** Change disable, if already in favorites */}
                                    <Button 
                                            onClick={addToFavHandler}
                                            className='btn-block' 
                                            type='button'>
                                            Favorite</Button>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty:</Col>
                                        <Col xs='auto' className='my-1'>
                                            <Form.Control
                                                type='number'
                                                as='textarea'
                                                onChange={(e) => setQty(e.target.value)}
                                            >
                                            </Form.Control>
                                
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Button 
                                        onClick={submitBuyHandler}
                                        className='btn-block' 
                                        type='button'
                                        >
                                            Buy</Button>
                                </ListGroup.Item>


                                <ListGroup.Item>
                                    <Button 
                                        onClick={submitSellHandler}
                                        className='btn-block' 
                                        type='button'
                                        >
                                            Sell</Button>
                                </ListGroup.Item>
                            </ListGroup>
                            {message && <Message variant='danger'>{message}</Message>}

                        </Card>
                    </Col>
            </Row>
                )
            }
        </Container>  
        </div>
       
    )
}

export default CreatorScreen