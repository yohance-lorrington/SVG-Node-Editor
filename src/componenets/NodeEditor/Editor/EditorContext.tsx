import * as React from 'react';

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
const NodeList = React.createContext<EditorContext | null>(null);

export const NodeProvider = NodeList.Provider;
export const NodeConsumer = NodeList.Consumer;

export default NodeList;