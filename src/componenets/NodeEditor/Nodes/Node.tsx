import * as React from "react";
import * as ReactDOM from "react-dom";
import InputRange from './Input';
import styled from 'styled-components';


const Node = styled.div`
    width: 200px;
    border-radius: 3px;
    background: white;
    padding-bottom: 3px;
    position: absolute;
    #title p{
        padding: 5px;
        font-size: 0.9em;
        border-radius: 3px 3px 0 0;
        background: #eee;
        margin: 0;
    }
    #connections{
        display: flex;
    }
    #outputs{
        border-left: 1px solid #ddd;
        margin-left: auto;
        justify-self: flex-end;
    }
    #output{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px;
    }
    .connector{
        position: relative;
        left: 15px;
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: #a05e5e;
        border: 1px solid black;
    }
    #output div{
        left: 15px;
    }
    .connector:hover{
        border: 1px solid white;
    }
    
`;
interface Connector {
    type: string,
    value: number
}

interface NodeProps {
    top: number,
    left: number,
    inputs?: Map<string,Connector>,
    outputs?: Map<string,Connector>
}

interface NodeState { top: string, left: string }


class BaseNode extends React.Component<NodeProps,NodeState>{
    elmnt: HTMLElement;
    pos1: number;
    pos2: number;
    pos3: number;
    pos4: number;
    self: Element | Text;

    constructor(props){
        super(props);
        this.elmnt = null;
        this.self = null;
        this.pos1 = 0;
        this.pos2 = 0;
        this.pos3 = 0;
        this.pos4 = 0;

        this.state = {
            top: `${this.props.top}px`,
            left: `${this.props.left}px`
        }
    }
    static defaultProps = {
        top: 80,
        left: 0
    };
    dragmousedown(e){
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement.bind(this);
        // call a function whenever the cursor moves:
        document.onmousemove = this.elementDrag.bind(this);
    }
    elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        // set the element's new position:
        if(this.self instanceof HTMLElement){
            this.setState({
                top: `${this.self.offsetTop - this.pos2}px`,
                left: `${this.self.offsetLeft - this.pos1}px`
            });
        }

      }
    closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = ()=>{};
        document.onmousemove = ()=>{};
    }
    componentDidMount(){
        this.self = ReactDOM.findDOMNode(this);
        if(this.self instanceof HTMLElement){
            this.elmnt = this.self.querySelector("#title");
        }
        this.elmnt.onmousedown = this.dragmousedown.bind(this);
    }
    render() {
        return (

            <Node style={{ top: this.state.top, left: this.state.left }}>
            <div id="title"><p>Range</p></div>
            <div id="outputs">
                <div id="output">
                    <InputRange/>
                    <div className="connector"></div>
                </div>
            </div>
        </Node>

        )
    }
 

}

export default BaseNode;