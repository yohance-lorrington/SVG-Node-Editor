import * as React from "react";
import styled from 'styled-components';

interface Props {
    left: number,
    top: number,
    show: boolean
}
const Menu = styled.div`
    width: 200px;
    background: #666;
    border-radius: 4px;
    display: ${props => props.showContextMenu ? 'block': 'none'};
    position: relative;
    left: ${props => props.contextMenuLeft}px;
    top: ${props => props.contextMenuTop}px;
    ul{
        margin: 0;
        padding: 0;
        list-style-type: none;
        li{
            padding: 5px 10px;
            input{
                font-size: 1.1rem;
                color: white;
                border: none;
                border-bottom: 1px solid #999;
                background: transparent;
                width: 100%;
            }
            button{
                color: white;
                font-size: 1rem;
                width: 100%;
                background: transparent;
                border: none;
                cursor: pointer;
                text-align: left;
            }
            input:focus{outline:none}
            button:focus{outline:none}
        }
        hr{
            margin: 0
        }
    }
        
`;
class ContextMenu extends React.Component<Props>{
    
    render(){
        return(
        <Menu id="yeet"showContextMenu={this.props.show} contextMenuLeft={this.props.left} contextMenuTop={this.props.top}>
            <ul>
                <li><input type="text" placeholder="Search"/></li>
                <hr/>
                <li><button>Filters</button></li>
            </ul>
        </Menu>
        );
    }
}
export default ContextMenu;