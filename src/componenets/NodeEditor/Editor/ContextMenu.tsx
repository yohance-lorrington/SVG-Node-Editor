import * as React from 'react';
import {editorUI} from '../EditorStates'
import * as uuidv4 from 'uuid/v4';
import NodeList from './EditorContext';
import styled from 'styled-components';

const CtxMenu = styled.div`
    box-sizing: border-box;
    padding-top: 10px;
    width: 200px;
    height: 100px;
    position: absolute;
    border-radius: 4px;
    background: rgba(0.4,0.4,0.4,0.8);
    display: none;
`;

const MenuItem = styled.p`
    padding: 5px 15px;
    cursor: pointer;
    color: white;
    margin: 0;
`
interface ContextMenuProps{
    getPos: Function
}
const ContextMenu = React.forwardRef((props: ContextMenuProps, ctxRef: React.Ref<HTMLDivElement>)=>{
    const {nodeList, setNodeList} = React.useContext(NodeList);
    let addNode = (e)=>{
        e.stopPropagation();
        let pos = props.getPos();
        setNodeList([...nodeList,{
            type: e.currentTarget.dataset.val,
            top: (pos.y-editorUI.y)/editorUI.scale,
            left: (pos.x-editorUI.x)/editorUI.scale,
            key: uuidv4()
        }])
    }
    
    return(
        <CtxMenu ref={ctxRef}>
            <MenuItem data-val={"ConstantNumber"} onClick={addNode}> Number </MenuItem>
            <MenuItem data-val={"ExampleNode"} onClick={addNode}> Add </MenuItem>
        </CtxMenu>
    );
});

export default ContextMenu;