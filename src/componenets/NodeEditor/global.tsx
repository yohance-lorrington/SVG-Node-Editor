export const UIScale = {
    scale: 1,
    x: 0,
    y: 0
}
export let currentConnection:ConnectionState ={
    didBeginInput:false,
    lineObject: null,
    input:{
        uuid:null,
        index:-1
    },
    output:null
};

export interface ConnectionState{
    didBeginInput:boolean,
    lineObject:any,
    input:{
        uuid: string,
        index: number,
    },
    output:string
}
export const EditorState = {
    Nodes: {},
    Connections: Array<ConnectionState>(),
}
export function initNodeState(){
    let inputRects = [];
    for(var inRef of this.inpRefs){
        inputRects.push(inRef.current.getBoundingClientRect())
    };
    let inpOffsets = [];
    for(var rect of inputRects){
        let offset = {
            x: (this.props.left - (rect.left+rect.right)/2),
            y: (this.props.top - (rect.top+rect.bottom)/2) - window.scrollY
        };
        inpOffsets.push(offset);
    }
    let outRect = this.outRef.current.getBoundingClientRect();
    let outOffset = {
        x: (this.props.left - (outRect.left+outRect.right)/2),
        y: (this.props.top - (outRect.top+outRect.bottom)/2) - window.scrollY
    }
    let inputStates = inpOffsets.map((offset, i)=>{
        return{el: this.inpRefs[i].current, ofst: offset}
    });
    EditorState.Nodes[this.uuid] = {
        root: {
            el:this.dragTarget,
            pos: {
                x: this.props.left,
                y: this.props.top
            }
        },
        inputs: inputStates,
        output: {
            el: this.outRef.current,
            ofst: outOffset
        }

    }
}