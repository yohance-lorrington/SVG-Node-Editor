interface InputNodeID{
     value: String;
}

interface OutputNodeID{
    value: String;
}

interface Input{
    ID: InputNodeID;
}

interface Output{
    Type: Node;
    ID: OutputNodeID;
}

interface Node{
    Inputs: Array<Input>;
    Outputs: Array<Output>;
    Operation: Function;
}

interface Connector{
    From: OutputNodeID;
    To: InputNodeID
}

interface Graph {
    Nodes : Array<Node>;
    Connectors: Array<Connector>;
}