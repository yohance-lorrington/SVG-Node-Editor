import * as React from 'react';
import {EditorStateClass} from '../EditorStates';
export interface EditorNode{
    type: string;
    top: number;
    left: number;
    key: string
}

interface EditorContext{
    nodeList: Array<EditorNode>;
    setNodeList: Function;
}
interface CurrentEditorState{
    mainEditor: EditorStateClass,
    modifyEditor: Function
}
const NodeList = React.createContext<EditorContext | null>(null);


export const EditorStateContext = React.createContext<CurrentEditorState|null>(null);


export const NodeProvider = NodeList.Provider;
export const NodeConsumer = NodeList.Consumer;

export default NodeList;