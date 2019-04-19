import * as React from "react";
import ContextMenu from './ContextMenu';
import styled from 'styled-components';
import BaseNode from './Nodes/Node';
import BezierCurve from './BezierCurve/Bezier'; 
interface State{
    contextMenuLeft: number,
    contextMenuTop: number,
    showContextMenu: boolean
}
const Editor = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #232323;
    background-size: 20px 20px;
    background-image: linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px);
    :before{
        content:"";
        position:absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-size: 100px 100px;
        background-image: linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px);
    }
`;
class NodeEditor extends React.Component<{},State>{
    constructor(props){
        super(props);
        this.state = {
            contextMenuLeft: 0,
            contextMenuTop: 0,
            showContextMenu: false
        }
    }
    componentDidMount(){
        window.addEventListener("contextmenu",e=>{
            if(e.srcElement.id == "Editor"){
                e.preventDefault();
                const origin = {
                    left: e.pageX,
                    top: e.pageY
                };
                this.setState({
                    contextMenuLeft: origin.left ,
                    contextMenuTop: origin.top,
                    showContextMenu: true
                });
            }
        });
        window.addEventListener('click',e=>{
            if(this.state.showContextMenu&&e.srcElement.parentElement.parentElement.parentElement.id!='yeet')
                this.setState({showContextMenu:false});
        });
    }

    render() {

        return (

            <Editor id="Editor">
                <BaseNode left={250} top={80} />
                <BezierCurve beginPointX={100} beginPointY={50} endPointX={250} endPointY={100} color="red"/>
                <BaseNode/>
                <ContextMenu left={this.state.contextMenuLeft} top={this.state.contextMenuTop} show={this.state.showContextMenu}/> 
            </Editor>
        )
    }
}

export default NodeEditor;