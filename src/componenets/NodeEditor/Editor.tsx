import * as React from "react";
import styled from 'styled-components';
import BaseNode from './Nodes/Node';
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
    }
    componentDidMount(){
    }

    render() {
        return (
            <Editor id="Editor">
                <BaseNode left={250} top={80} />
            </Editor>
        )
    }
}

export default NodeEditor;