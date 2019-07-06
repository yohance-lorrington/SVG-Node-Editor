import * as React from 'react';
const NodeList = React.createContext({})

export const NodeProvider = NodeList.Provider;
export const NodeConsumer = NodeList.Consumer;

export default NodeList;