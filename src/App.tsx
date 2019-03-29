import * as React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

import Navbar from './componenets/navbar/navbar';
import NodeEditor from './componenets/NodeEditor/Editor';

const Hero = styled.div`
  background: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  :after{
    content:'';
    
  background: #b0744e;
  background-size: cover;
  background-position: left 0px top -53px;
    position: fixed;
    height: 100%;
    width: 100%;
  }
`;
const Home = ()=>{
  return(
    <Hero>
    </Hero>
  );
}
const App = ()=> {
  return (
    <>
      <Router>
        <>
          <Navbar/>
          <Route exact path="/" component={Home} />
          <Route path="/node-editor" component={NodeEditor} />
        </>
      </Router>
    </>
  );
}

export default App;