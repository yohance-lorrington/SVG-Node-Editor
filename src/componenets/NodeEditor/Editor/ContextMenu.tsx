import * as React from 'react';
import {FunctionComponent, useEffect, useState} from 'react';
import {editorUI} from '../EditorStates'
import * as uuidv4 from 'uuid/v4';
import ExampleNode from '../Nodes/ExampleNode';
import ConstantNumber from '../Nodes/ConstantNumber';
import NodeList, {NodeProvider, NodeConsumer} from './EditorContext';
import styled from 'styled-components';

const CtxMenu = styled.div`
    width: 200px;
    height: 100px;
    position: absolute;
    border-radius: 4px;
    background: rgba(0.4,0.4,0.4,0.8);
    display: none;
`;

const MenuItem = styled.p`
    padding: 15px;
    color: white;
    margin: 0;
`
interface Props{
    setNodes: Function;
}
interface Waw{
    nodeList: Array<{}>;
    setNodeList: Function;
}
const ContextMenu = React.forwardRef((props, ctxRef: React.Ref<HTMLDivElement>)=>{
    const {nodeList, setNodeList} = React.useContext(NodeList) as Waw;
    
    let yaes = (e)=>{
        e.stopPropagation();
        console.log(e.currentTarget.dataset.val)
        setNodeList([...nodeList,{
            type: 'ConstantNumber',
            top: 400,
            left: 50,
            key: uuidv4()
        }])
    }
    
    return(
        <CtxMenu ref={ctxRef}>
            <MenuItem data-val={"ConstantNumber"} onClick={yaes}> Number </MenuItem>
        </CtxMenu>
    );
});

export default ContextMenu;