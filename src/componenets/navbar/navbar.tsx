import * as React from "react";

import styled from 'styled-components';
import {Link} from 'react-router-dom';
const logo = require('../../../assets/mini-02.svg');

const Nav = styled.div`
    display: block;
    position: fixed;
    top: 0;
    z-index: 10;
    width: 100vw;
    img{
        height: 25px;
        margin: 0;
    }
    nav{
        
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-top: 12px;
        padding-bottom: 12px;
        background: rgba(0,0,0,0.4);
    }
    a{
        margin: 0 20px;
        text-decoration: none;
        color: 	white;
        font-size: 20px; 
    }
`;

class Navbar extends React.Component{
    
    render() {
        return (
            <Nav>
                <nav>
                    <Link to='/'><img src={logo} alt=""/></Link>
                    <div className="right">
                    <Link to='/'>Home</Link>
                    <Link to='/node-editor'>Editor</Link>
                    </div>
                </nav>
            </Nav>
        )
    }
}

export default Navbar;