import * as React from 'react';
import {FunctionComponent, useEffect, useState} from 'react';

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
const ContextMenu = React.forwardRef((props:Props, ctxRef: React.Ref<HTMLDivElement>)=>{
    const context = React.useContext(NodeList);
    useEffect(()=>{
        this.item.addEventListener('click',()=>{
            //const newNodeList = (context as Array<JSX.Element>).push()
            let crap = [...context as Array<JSX.Element>];crap.push(<ExampleNode top={500} left={50}/>)
            console.log(crap)
            props.setNodes(crap);
        })
    });

    
    return(
        <CtxMenu ref={ctxRef}>
            <MenuItem ref = {ref=> this.item = ref}> Number </MenuItem>
        </CtxMenu>
    );
});

export default ContextMenu;