import * as React from "react";
import {createRef} from 'react';

import {d3Drag} from '../UIinteractions';
import {createInputOnly, handleConnection, removeInputConnection, contextMenu} from './NodeParts/NodeHelpers';
import {initNodeState,EditorState,EditorStateClass} from '../EditorStates';

import Node from './NodeParts/Node';
import Title from './NodeParts/Title';
import NodeProps from './NodeParts/NodeProps';
import ASTNode from './NodeParts/ASTNode';
import {EditorStateContext} from '../Editor/EditorContext'
class DisplayNode extends React.Component<NodeProps,{value: number}> {
    uuid: string;
    title: string;
    dragTarget: HTMLDivElement;
    handle : React.Ref<HTMLDivElement>;
    inpRefs : React.Ref<HTMLDivElement>[];
    input : JSX.Element;
    ASTNode: ASTNode;
    value: number;
    mainEditor:any;
   
    static contextType =  EditorStateContext;
    constructor(props){
        super(props);
        this.uuid = props.uuid;
        this.value = 1;
        this.handle = createRef();
        this.inpRefs = [];
        this.inpRefs.push(createRef());
        this.state = {
            value: 0
        }
        this.title = 'Display';
        createInputOnly.bind(this)();
        let inputs:Array<ASTNode> = new Array<ASTNode>(1);
        inputs[0] = new ASTNode(null,()=>0);
        this.ASTNode = new ASTNode(inputs, function(){
            this.setState({value: inputs[0].resolve()});
        }.bind(this));    
        
    }

    componentDidMount(){
        this.mainEditor = this.context.mainEditor;
        d3Drag.bind(this)();
        initNodeState.bind(this)(this.mainEditor);
        this.dragTarget.addEventListener('contextmenu',contextMenu.bind(this));
        this.mainEditor.rootID = this.uuid;
        this.mainEditor.ASTRoot = this.ASTNode;
        
    
        this.mainEditor.ASTRoot.resolve()
        this.context.modifyEditor(this.mainEditor);
    }
    componentWillUnmount(){
        this.dragTarget.removeEventListener('contextmenu',contextMenu.bind(this));
    }
    render(){
        return (
            <Node width={150} singular ref={dragTarget => this.dragTarget = dragTarget} style={{ top: `${this.props.top}px`, left:  `${this.props.left}px` }}>
                <Title ref={this.handle} title={this.title}/>
                
                <div className="connections">
                    <div className="inputs">
                    <div className="input">
                        <div onMouseUp={handleConnection.bind(this, 0)} onMouseDown={handleConnection.bind(this, 0)} onClick={removeInputConnection.bind(this,0)} ref={this.inpRefs[0]} className="in connector"></div>
                        <h4>{this.state.value.toFixed(5)}</h4>
                    </div>
                    </div>
                </div>
            </Node>
        );
    }
}

export default DisplayNode;