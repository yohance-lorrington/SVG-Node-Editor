import * as React from 'react';
import {deleteNode, EditorState} from '../EditorStates';
import NodeList from './EditorContext';
import {CtxMenu, MenuItem} from './ContextMenu';

const NodeMenu = React.forwardRef((props, ctxRef: React.Ref<HTMLDivElement>)=>{
    const {nodeList, setNodeList} = React.useContext(NodeList);
    
    let deleteMe = ()=>{
        let withoutMe = nodeList.filter((item)=>{
            return item.key !== EditorState.currentNode;
        });
        EditorState.removeOutputConnections(EditorState.currentNode);
        EditorState.removeAllInputConnections(EditorState.currentNode);
        setNodeList(withoutMe);
        EditorState.currentNode = undefined;
    }
    React.useEffect(()=>{
        this.delete.addEventListener('click', deleteMe);
        return(()=>{
            this.delete.removeEventListener('click', deleteMe)
        })
    })
    return (
        <CtxMenu ref={ctxRef}>
            <MenuItem ref={ref=>this.delete = ref}>Delete</MenuItem>
        </CtxMenu>
    )
})

export default NodeMenu;