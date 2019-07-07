import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FunctionComponent, useEffect, useState} from 'react';
import {d3Zoom} from '../UIinteractions';

import * as uuidv4 from 'uuid/v4';
import EditorBG from './EditorBG';
import ContextMenu from './ContextMenu';
import {connectNodes} from '../EditorStates'
import DisplayNode from '../Nodes/DisplayNode';
import AddNode from '../Nodes/AddNode';
import SubtractNode from '../Nodes/SubtractNode';
import MultiplyNode from '../Nodes/MultiplyNode';
import DivideNode from '../Nodes/DivideNode';
import RangeNode from '../Nodes/RangeNode';
import ConstantNode from '../Nodes/ConstantNode';
import AbsNode from '../Nodes/AbsNode';
import ExponentNode from '../Nodes/ExponentNode';

import {EditorNode, NodeProvider, NodeConsumer} from './EditorContext';

//UI composed inside of SVG container to more easily handle complex transformations, such as zooming and panning.
const NodeEditor: FunctionComponent = ()=>{
    useEffect(d3Zoom.bind(this, true)); //enables panning and zooming via d3's zoom functionality, also updates the editor's state(non-react incase it needs to be used with a different front end solution)
    useEffect(()=>{
        this.svg.addEventListener('contextmenu', showContextmenu);
        document.addEventListener('click', hideContextMenu)
    });
    let [nodeList,setNodeList] = useState<Array<EditorNode>>([
        {
            type: 'DisplayNode',
            top: 100,
            left: 180,
            key: uuidv4()
        },
        {
            type: 'ConstantNode',
            top: 100,
            left: 50,
            key: uuidv4()
        }, 
        {
            type: 'AddNode',
            top: 200,
            left: 50,
            key: uuidv4()
        },        
        {
            type: 'SubtractNode',
            top: 300,
            left: 50,
            key: uuidv4()
        }
    ]);
    
    let visible = false;
    let ctxPos = {
        x: 0,
        y: 0
    }
    let getCtxPos = ()=>{
        return ctxPos;
    }
    let showMenu = state => {
        this.ctxMenu.style.display = state ? "block" : "none";
    }
    let showContextmenu = (e)=>{
        e.preventDefault();
        ctxPos.x = e.clientX;
        ctxPos.y = e.clientY;
        this.ctxMenu.style.left = `${ctxPos.x}px`;
        this.ctxMenu.style.top = `${ctxPos.y}px`;
        visible = true;
        showMenu(true);
    }
    let hideContextMenu = ()=>{
        if(visible){
            showMenu(false);
            visible = false;
        }
    }
    let createNodes = (value)=>{
        return value.nodeList.map((node)=>{
            switch(node.type){
                case "DisplayNode":
                    return <DisplayNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>    
                case "ConstantNode":
                    return <ConstantNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>    
                case "RangeNode":
                    return <RangeNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>
                case "AddNode":
                    return <AddNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>
                case "SubtractNode":
                    return <SubtractNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>   
                case "MultiplyNode":
                    return <MultiplyNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>
                case "DivideNode":
                        return <DivideNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>
                case "AbsNode":
                    return <AbsNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>
                case "ExponentNode":
                    return <ExponentNode key={node.key} uuid={node.key} top={node.top} left={node.left}/>
        }
        })
    }
    useEffect(()=>{connectNodes({uuid:nodeList[2].key,index:0},nodeList[1].key)});
    return (
        <NodeProvider value={{nodeList: nodeList, setNodeList: setNodeList}}>
        <EditorBG>
            <svg id="editor"  ref={svg => this.svg = svg} width="100%" height="100%" >
                <g width="100%" height="100%" ref={ui => this.ui = ui}>
                    <g width="100%" height="100%" id="connections"></g>
                    <foreignObject width="100%" height="100%" style={{overflow: 'visible'}}>
                        <NodeConsumer>
                            {value=>createNodes(value)}
                        </NodeConsumer>
                    </foreignObject>
                </g>
            </svg>
        <ContextMenu getPos={getCtxPos} ref={ctxMenu => this.ctxMenu = ctxMenu}/>
        </EditorBG>
        </NodeProvider>
    );
}
export default NodeEditor;