import * as React from 'react';

import {useState} from 'react';
import {editorUI} from '../EditorStates'
import * as uuidv4 from 'uuid/v4';
import NodeList from './EditorContext';
import styled from 'styled-components';

export const CtxMenu = styled.div`
    box-sizing: border-box;
    padding: 10px 15px;
    width: 200px;
    position: absolute;
    border-radius: 2px;
    background: rgba(0.4,0.4,0.4,0.8);
    display: none;
`;
export const MenuItem = styled.p`
    padding: 5px 0;
    cursor: pointer;
    color: white;
    margin: 0;
    border-bottom: 1px solid #222;
`;
const Search = styled.input`
    width: 170px;
    margin-left: -15px;
    background: #222;
    opacity: 0.9;
    border-radius: 2px;
    border: none;
    color: white;
    padding: 10px 15px;
    margin-bottom: 10px;
    font-size: 1em;
    :focus{
        outline: none;
    }
`;
interface ContextMenuProps{
    getPos: Function
}
let nodeArray = [
    {
        type: 'ConstantNode',
        name: 'Constant'
    },
    {
        type: 'RangeNode',
        name: 'Range'
    },
    {
        type: 'AddNode',
        name: 'Add'
    },
    {
        type: 'SubtractNode',
        name: 'Subtract'
    },
    {
        type: 'MultiplyNode',
        name: 'Multiply'
    },
    {
        type: 'DivideNode',
        name: 'Divide'
    },
    {
        type: 'ExponentNode',
        name: 'Exponent'
    },
    {
        type: 'AbsNode',
        name: 'Absolute'
    },
    {
        type: 'ModulusNode',
        name: 'Modulus'
    }

];
const ContextMenu = React.forwardRef((props: ContextMenuProps, ctxRef: React.Ref<HTMLDivElement>)=>{
    const {nodeList, setNodeList} = React.useContext(NodeList);
    let [nodes, filteredNodes] = useState(nodeArray);
    let addNode = (e)=>{
        let pos = props.getPos();
        setNodeList([...nodeList,{
            type: e.currentTarget.dataset.val,
            top: (pos.y-editorUI.y)/editorUI.scale,
            left: (pos.x-editorUI.x)/editorUI.scale,
            key: uuidv4()
        }]);
        this.search.value = ''
        filterNodes({target: {value: ''}});
    }
    let filterNodes = (e)=>{
        let yes = nodeArray.filter((el)=>{
            let searchValue = el.name.toLowerCase();
            return searchValue.indexOf(e.target.value.toLowerCase()) !== -1;
        });
        filteredNodes(yes);
    }
    return(
        <CtxMenu ref={ctxRef}>
            <Search id="ctxSearch" ref={ref=>this.search = ref} onChange={filterNodes} type="text" placeholder="Search"/>
            {
                nodes.map((node, index)=>
                    <MenuItem key={index} data-val={node.type} onClick={addNode}> {node.name} </MenuItem>
                )
            }
        </CtxMenu>
    );
});

export default ContextMenu;