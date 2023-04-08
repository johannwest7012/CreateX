import React, {useEffect} from 'react'
import { Link, useParams, useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, Container } from 'react-bootstrap'
import  Message from '../components/Message'
import { addToFavs, removeFromFavs } from '../actions/favoritesActions'
import history from '../history'


function FavoritesScreen() {

    let params = useParams();
    
    const creatorId = params.id
    
    const dispatch = useDispatch()

    const favorites = useSelector(state => state.favorites);
    const { favItems } = favorites;
    console.log('favItems:', favItems);

    useEffect(() => { 
        if (creatorId) { 
            dispatch(addToFavs(creatorId))
        }
     }, [dispatch, creatorId])

     const unfavHandler = (id) => {
        dispatch(removeFromFavs(id))
     }

    return (
        <Container>
        <Row>
            <Col md={8}>
                <br></br>
                <h1>Favorites</h1>
                {favItems.length === 0 ?(
                    <Message variant='infor'>
                        You have no favorites yet, you should add some <Link to='/home'>Go Back</Link>
                    </Message>
                ) : (
                    <ListGroup variant='flush'>
                        {favItems.map(item => 
                            <ListGroup.Item key={item.creator}>
                                <Row style={{marginBottom: '15px'}}>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid roundedCircle/>
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/creator/${item.creator}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                       ${item.price} 
                                    </Col>
                                    <Col md={1}>
                                        <Button 
                                            onClick={() => unfavHandler(item.creator)}
                                            className='btn-block' 
                                            type='button'>
                                            Unfavorite
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            )}
                    </ListGroup>
                )
                }
            </Col>

            <Col md={4}>
            </Col>
        </Row>
        </Container>
    )
}

export default FavoritesScreen