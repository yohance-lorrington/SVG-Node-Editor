import * as React from "react";
import {createRef} from 'react';

import {d3Drag} from '../UIinteractions';
import {createInputOnly, handleConnection, removeInputConnection, contextMenu} from './NodeParts/NodeHelpers';
import {initNodeState, EditorState} from '../EditorStates';

import Node from './NodeParts/Node';
import Title from './NodeParts/Title';
import NodeProps from './NodeParts/NodeProps';
import ASTNode from './NodeParts/ASTNode';

class DisplayNode extends React.Component<NodeProps,{value: number}> {
    uuid: string;
    title: string;
    dragTarget: HTMLDivElement;
    handle : React.Ref<HTMLDivElement>;
    inpRefs : React.Ref<HTMLDivElement>[];
    input : JSX.Element;
    ASTNode: ASTNode;
    value: number;
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
        let inputs:Array<ASTNode> = new Array<ASTNode>(1);
        inputs[0] = new ASTNode(null,()=>0);
        this.ASTNode = new ASTNode(inputs, function(){
            this.setState({value: inputs[0].resolve()});
        }.bind(this));

        EditorState.ASTRoot = this.ASTNode;
        createInputOnly.bind(this)();
        EditorState.rootID = this.uuid;
    }

    componentDidMount(){
        d3Drag.bind(this)();
        initNodeState.bind(this)();
        
        this.dragTarget.addEventListener('contextmenu',contextMenu.bind(this));
        EditorState.ASTRoot.resolve();
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