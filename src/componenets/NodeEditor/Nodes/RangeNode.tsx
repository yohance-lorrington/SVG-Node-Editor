import * as React from "react";
import {createRef} from 'react';

import {d3Drag} from '../UIinteractions';
import {createOutputWithRange, contextMenu} from './NodeParts/NodeHelpers';
import {initNodeState, EditorState} from '../EditorStates';


import Node from './NodeParts/Node';
import Title from './NodeParts/Title';
import NodeProps from './NodeParts/NodeProps';
import ASTNode from './NodeParts/ASTNode';

class RangeNode extends React.Component<NodeProps> {
    uuid: string;
    title: string;
    dragTarget: HTMLDivElement;
    handle : React.Ref<HTMLDivElement>;
    outRef : React.Ref<HTMLDivElement>;
    output : JSX.Element;
    ASTNode: ASTNode;
    value: number;
    constructor(props){
        super(props);
        this.uuid = props.uuid;
        this.value = 0.5;
        this.handle = createRef();
        let structure = {
            title: 'Number',
            output: 'Number'
        };
        this.title = structure.title;
        this.ASTNode = new ASTNode(null, ()=>{
            return this.value;
        });
        createOutputWithRange.bind(this)(structure);
    }
    shouldComponentUpdate(){return false};
    componentDidMount(){
        d3Drag.bind(this)();
        initNodeState.bind(this)();
        this.dragTarget.addEventListener('contextmenu',contextMenu.bind(this));
    }
    componentWillUnmount(){
        this.dragTarget.removeEventListener('contextmenu',contextMenu.bind(this));
    }
    
    setValue(value: number){
        this.value = value;
        EditorState.ASTRoot.resolve();
    }
    render(){
        return (
            <Node width={200} singular ref={dragTarget => this.dragTarget = dragTarget} style={{ top: `${this.props.top}px`, left:  `${this.props.left}px` }}>
                <Title ref={this.handle} title={this.title}/>
                
                <div className="connections">
                    <div className="outputs">
                        {this.output}
                    </div>
                </div>
            </Node>
        );
    }
}

export default RangeNode;