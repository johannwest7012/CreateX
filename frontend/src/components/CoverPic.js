import React from 'react';
import styled from 'styled-components';
import { Row, Col, Button} from 'react-bootstrap'


const Container = styled.div`
  position: relative;
`;


const Image = styled.div`
  background-image: url(${require('./images/createxheroimg1.png')});
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 550px; /* adjust height as needed */
  margin: 0;
`;


const Text = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: left;
  width: 100%;
  margin: 50px;
  background-color: 'white';
`;

const CoverPic = () => {
  return (
    <Container>
        <Image />
            <Text>
            <div style={{ backgroundColor: 'white', padding: '20px', display: 'inline-block',width: '35%' }}>
                <h1 className='display' style={{ lineHeight: '0.78em' }}>Invest In</h1>
            </div><br/>
            <div style={{ backgroundColor: 'white', padding: '20px', display: 'inline-block',width: '38%' }}>
                <h1 className='display _3' style={{ lineHeight: '0.78em' }}>Creators</h1>
            </div>
            
            
          
            </Text>
            
    </Container>
  );
};

export default CoverPic;