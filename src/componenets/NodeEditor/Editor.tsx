import * as React from "react";
import styled from 'styled-components';
import ASTNode from './Node';
import BaseNode from './Nodes/Node'

interface State{
    contextMenuLeft: number,
    contextMenuTop: number,
    showContextMenu: boolean
}
const Editor = styled.div`
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #232323;
    background-size: 20px 20px;
    background-image: linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px);
    :before{
        content:"";
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
        let n1 = new ASTNode([],()=>{
            return 1;
        });
        let n2 = new ASTNode([],()=>{
            return 2;
        });
        
        let add = new ASTNode([n1,n2],function add(){
            return this.inputs[0].resolve() + this.inputs[1].resolve();
        }
        )
        let multiply = new ASTNode([add, n2],function(){
            return this.inputs[0].resolve()*this.inputs[1].resolve();
        });
        console.log(multiply.resolve())
        return (
            <Editor id="Editor">
                <BaseNode/>
                <BaseNode/>
                <BaseNode/>
                <BaseNode/>
                <BaseNode/>
            </Editor>
        )
    }
}

export default NodeEditor;