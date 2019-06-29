import * as React from "react";
import {createRef} from 'react';

import {EditorState} from '../../global' 
import {inputDraw, outputDraw} from '../../d3Interactions';

import RangeInput from './Input';

export function createInputs(structure) {
    this.inpRefs = [];
    this.input = structure.inputs.map((name, i)=>{
        this.inpRefs.push(createRef());
        return (
            <div key={i} className="input">
                <div onMouseUp={handleConnection.bind(this, i)} onMouseDown={handleConnection.bind(this, i)} onClick={removeInputConnection.bind(this,i)} ref={this.inpRefs[i]} className="in connector"></div>
                {name}
            </div>
        )
    });
}
export function createOutput(structure) {
    this.outRef = createRef();
    this.output = (
        <div className="output">            
            {structure.output}
            <div onMouseUp={handleConnection.bind(this,null)} onMouseDown={handleConnection.bind(this,null)} ref={this.outRef} className="out connector"></div>
        </div>
    )
}
export function createOutputWithRange(structure){
    this.outRef = createRef();
    this.output = (
        <div className="output">            
            <RangeInput title={structure.output}/>
            <div onMouseUp={handleConnection.bind(this,null)} onMouseDown={handleConnection.bind(this,null)} onClick={removeOutputConnections.bind(this)} ref={this.outRef} className="out connector"></div>
        </div>
    )
}
function handleConnection(index){
    let parent = EditorState.Nodes[this.uuid];
    let referencePositon = parent.root.pos;
    if(index===null){
        let outputOffset = parent.output.ofst;
        let outputPosition = {
            x: referencePositon.x - outputOffset.x,
            y: referencePositon.y - outputOffset.y
        }
        outputDraw.bind(this)(outputPosition);
    }else{
        let inputOffset = parent.inputs[index].ofst;
        let inputPosition = {
            x: referencePositon.x - inputOffset.x,
            y: referencePositon.y - inputOffset.y
        };
        inputDraw.bind(this)(inputPosition,index);
    }
}

function removeInputConnection(index){
    EditorState.removeInputConnection({uuid:this.uuid,index:index});
}
function removeOutputConnections(){
    EditorState.removeOutputConnections(this.uuid);
}