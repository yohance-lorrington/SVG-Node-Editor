import * as React from 'react';
import {FunctionComponent, useEffect, useState,useLayoutEffect } from 'react';
import {d3Zoom} from '../UIinteractions';

import * as uuidv4 from 'uuid/v4';
import EditorBG from './EditorBG';
import ContextMenu from './ContextMenu';
import NodeMenu from './NodeMenu';

import DisplayNode from '../Nodes/DisplayNode';
import ConstantNode from '../Nodes/ConstantNode';


import {EditorNode, NodeProvider, NodeConsumer,EditorStateContext} from './EditorContext';
import {EditorState, EditorStateClass} from '../EditorStates';

//UI composed inside of SVG container to more easily handle complex transformations, such as zooming and panning.
const NodeEditor: FunctionComponent = ()=>{
    
    useEffect(d3Zoom.bind(this, true)); //enables panning and zooming via d3's zoom functionality, also updates the editor's state(non-react incase it needs to be used with a different front end solution)
    useEffect(()=>{
        this.svg.addEventListener('contextmenu', showContextmenu, false);
        this.editor.addEventListener('click', hideContextMenu, false);
        return (()=>{
            this.svg.removeEventListener('contextmenu', showContextmenu);
            this.editor.removeEventListener('click', hideContextMenu);
        });
    });
    let [currentEditorBoii,setEditorBoii] = useState<EditorStateClass>(new EditorStateClass());
        
    let rootID = uuidv4();
    let [nodeList,setNodeList] = useState<Array<EditorNode>>([
        {
            type: 'DisplayNode',
            top: 150,
            left:400,
            key: rootID
        },
        {
            type: 'ConstantNode',
            top: 100,
            left: 50,
            key: uuidv4()
        }, 
        {
            type: 'AddNode',
            top: 150,
            left: 180,
            key: uuidv4()
        },        
        {
            type: 'ConstantNode',
            top: 200,
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
    let showAddMenu = state => {
        this.ctxMenu.style.display = state ? "block" : "none";

    }
    let showNodeMenu = state =>{
        this.nodeMenu.style.display = state ? "block" : "none";
    }
    let showContextmenu = (e)=>{
        e.preventDefault();
        
        showAddMenu(false);
        showNodeMenu(false);
        ctxPos.x = e.clientX;
        ctxPos.y = e.clientY;
        this.ctxMenu.style.left = `${ctxPos.x}px`;
        this.ctxMenu.style.top = `${ctxPos.y}px`;
        this.nodeMenu.style.left = `${ctxPos.x}px`;
        this.nodeMenu.style.top = `${ctxPos.y}px`;
        visible = true;
        if(e.target.id == "editor" || e.target.id == "container"){
            EditorState.currentNode = undefined;
        }
        if( !EditorState.currentNode){
            showAddMenu(true);
            showNodeMenu(false);
            console.log('not a node')
        }
        if(EditorState.currentNode){
            showNodeMenu(true);
            showAddMenu(false);
            console.log('node')
        }
    }
    let hideContextMenu = (e)=>{
        if(e.target.id != "ctxSearch"){
            EditorState.currentNode = undefined;
            showAddMenu(false);
            showNodeMenu(false);
        }
    }
    let createNodes = (value)=>{

        return value.nodeList.map(node=>{
            switch(node.type){
                case "DisplayNode":
                    return <DisplayNode key={node.key}  uuid={node.key} top={node.top} left={node.left}/>    
                case "ConstantNode":
                    return <ConstantNode key={node.key}   uuid={node.key} top={node.top} left={node.left}/>   
                default:
                    return null 
                }
        })
        
    }
    console.log(currentEditorBoii)
    return (
       
        <NodeProvider value={{nodeList: nodeList, setNodeList: setNodeList}}>
        <EditorStateContext.Provider value={{mainEditor:currentEditorBoii,modifyEditor:setEditorBoii}}>
        <EditorBG ref={ref=>this.editor = ref}>
            <svg id="editor"  ref={svg => this.svg = svg} width="100%" height="100%" >
                <g width="100%" height="100%" ref={ui => this.ui = ui}>
                    <g width="100%" height="100%" id="connections"></g>
                    <foreignObject id="container" width="100%" height="100%" style={{overflow: 'visible'}}>
                            <NodeConsumer>
                                {node=>createNodes(node)}
                            </NodeConsumer>}  
                    </foreignObject>
                </g>
            </svg>
        <ContextMenu getPos={getCtxPos} ref={ctxMenu => this.ctxMenu = ctxMenu}/>
        <NodeMenu ref={nodeMenu=>this.nodeMenu = nodeMenu}/>
        </EditorBG>
        </EditorStateContext.Provider>
        </NodeProvider>
   
    );
}
export default NodeEditor;