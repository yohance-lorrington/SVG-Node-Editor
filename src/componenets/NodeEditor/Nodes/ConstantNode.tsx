import * as React from "react";
import {createRef} from 'react';

import {d3Drag} from '../UIinteractions';
import {createOutputWithField, contextMenu} from './NodeParts/NodeHelpers';
import {initNodeState, EditorState} from '../EditorStates';

import Node from './NodeParts/Node';
import Title from './NodeParts/Title';
import NodeProps from './NodeParts/NodeProps';
import ASTNode from './NodeParts/ASTNode';

class ConstantNode extends React.Component<NodeProps> {
    uuid: string;
    title: string;
    dragTarget: HTMLDivElement;
    handle : React.Ref<HTMLDivElement>;
    outRef : React.Ref<HTMLDivElement>;
    output : JSX.Element;
    ASTNode: ASTNode;
    value: number;
    ctxMenu: any;
    visible: boolean;

    constructor(props){
        super(props);
        this.uuid = props.uuid;
        this.value = 1;
        this.handle = createRef();
        let structure = {
            title: 'Constant',
            output: 'Number'
        };
        this.title = structure.title;
        this.ASTNode = new ASTNode(null, ()=>{
            return this.value;
        });
        createOutputWithField.bind(this)();
        this.visible = false;
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
    removeMe(){
        // let withoutMe = this.editorNodes.nodeList.filter((item)=>{
        //     return item.key !== this.uuid;
        // });
        // this.editorNodes.setNodeList(withoutMe);
        // EditorState.removeOutputConnections(this.uuid);
        // delete EditorState.Nodes[this.uuid];
        // console.log(EditorState.Nodes)
    }
    render(){
        return (
            <Node width={100} singular ref={dragTarget => this.dragTarget = dragTarget} style={{ top: `${this.props.top}px`, left:  `${this.props.left}px` }}>
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

export default ConstantNode;