import * as React from "react";
import {createRef} from 'react';

export function createInputs(structure) {
    this.inpRefs = [];
    this.input = structure.inputs.map((name, i)=>{
        this.inpRefs.push(createRef());
        return (
            <div key={i} className="input">
                <div onMouseUp={this.handleMouse.bind(this, i)} onMouseDown={this.handleMouse.bind(this, i)} ref={this.inpRefs[i]} className="in connector"></div>
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
            <div onMouseDown={this.handleEndPoint.bind(this)} onMouseUp={this.handleEndPoint.bind(this)} ref={this.outRef} className="out connector"></div>
        </div>
    )
}