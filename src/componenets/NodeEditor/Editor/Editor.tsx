import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FunctionComponent, useEffect, useState} from 'react';
import {d3Zoom} from '../UIinteractions';

import * as uuidv4 from 'uuid/v4';
import EditorBG from './EditorBG';
import ContextMenu from './ContextMenu';
import ExampleNode from '../Nodes/ExampleNode';
import ConstantNumber from '../Nodes/ConstantNumber';

import NodeList, {NodeProvider, NodeConsumer} from './EditorContext';
import { node } from 'prop-types';
interface Waw{
    nodeList: Array<{}>;
    setNodeList: Function;
}
interface Noed{
    type: string;
    top: number;
    left: number;
    key: string
}
//UI composed inside of SVG container to more easily handle complex transformations, such as zooming and panning.
const NodeEditor: FunctionComponent = ()=>{
    useEffect(d3Zoom.bind(this, true)); //enables panning and zooming via d3's zoom functionality, also updates the editor's state(non-react incase it needs to be used with a different front end solution)
    useEffect(()=>{
        this.svg.addEventListener('contextmenu', showContextmenu);
        this.svg.addEventListener('click', hideContextMenu)
    });
    let [nodeList,setNodeList] = useState([
        {
            type: 'ExampleNode',
            top: 100,
            left: 50,
            key: uuidv4()
        },
        {
            type: 'ConstantNumber',
            top: 300,
            left: 50,
            key: uuidv4()
        }
    ]);
    
    let visible = false;
    let showMenu = state => {
        this.ctxMenu.style.display = state ? "block" : "none";
    }
    let showContextmenu = (e)=>{
        e.preventDefault();
        
        this.ctxMenu.style.top = `${e.clientY}px`;
        this.ctxMenu.style.left = `${e.clientX}px`;
        visible = true;
        showMenu(true);
    }
    let hideContextMenu = ()=>{
        if(visible){
            showMenu(false);
            visible = false;
        }
    }
    return (
        <NodeProvider value={{nodeList, setNodeList}}>
        <EditorBG>
            <svg id="editor"  ref={svg => this.svg = svg} width="100%" height="100%" >
                <g width="100%" height="100%" ref={ui => this.ui = ui}>
                    <g width="100%" height="100%" id="connections"></g>
                    <foreignObject ref={fO => this.fO = fO}width="100%" height="100%" style={{overflow: 'visible'}}>
                        <NodeConsumer>
                            {(value:Waw)=>{
                                console.log(value.nodeList.length);
                                return value.nodeList.map((node:Noed)=>{
                                    switch(node.type){
                                        case "ExampleNode":
                                            return <ExampleNode key={node.key} identifier={node.key} top={node.top} left={node.left}/>
                                        case "ConstantNumber":
                                            return <ConstantNumber key={node.key} identifier={node.key} top={node.top} left={node.left}/>    
                                    }
                                })
                            }}
                        </NodeConsumer>
                    </foreignObject>
                </g>
            </svg>
        <ContextMenu ref={ctxMenu => this.ctxMenu = ctxMenu}/>
        </EditorBG>
        </NodeProvider>
    );
}
export default NodeEditor;