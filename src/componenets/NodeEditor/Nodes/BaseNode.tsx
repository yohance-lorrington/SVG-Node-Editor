import * as React from "react";
import {createRef} from 'react';
import * as uuidv4 from 'uuid/v4';

import {d3Drag} from '../d3Interactions';
import {createInputs, createOutput} from './NodeParts/NodeHelpers';
import {initNodeState} from '../global';


import Node from './NodeParts/Node';
import Title from './NodeParts/Title';
import NodeProps from './NodeParts/NodeProps';
import ASTNode from './NodeParts/ASTNode';
class BaseNode extends React.Component<NodeProps> {
    uuid: string;
    title: string;
    dragTarget: React.Ref<HTMLDivElement>;
    handle : React.Ref<HTMLDivElement>;
    inpRefs: React.Ref<HTMLDivElement>[];
    outRef : React.Ref<HTMLDivElement>;
    input  : JSX.Element[];
    output : JSX.Element;
    ASTNode: ASTNode;
    
    constructor(props){
        super(props);
        this.uuid = uuidv4();
        this.handle = createRef();
        let structure = {
            title: "Add",
            inputs: [
                'Number 1',
                'Number 2'
            ],
            output: 'Sum'
        };
        this.title = structure.title;
        let inputs:Array<ASTNode> = new Array<ASTNode>(3);
        this.ASTNode = new ASTNode(inputs, function(){
            console.log(this.inputs.length)
        });
        this.ASTNode.resolve();
        createInputs.bind(this)(structure);
        createOutput.bind(this)(structure);
    }
    componentDidMount(){
        d3Drag.bind(this)();
        initNodeState.bind(this)();
    }
    render(){
        return (
            <Node ref={dragTarget => this.dragTarget = dragTarget} style={{ top: `${this.props.top}px`, left:  `${this.props.left}px` }}>
                <Title ref={this.handle} title={this.title}/>
                
                <div className="connections">
                    <div className="inputs">
                        {this.input}
                    </div>
                    <div className="vr"></div>
                    <div className="outputs">
                        {this.output}
                    </div>
                </div>
            </Node>
        );
    }
}

export default BaseNode;