import ASTNode from '../src/componenets/NodeEditor/Nodes/NodeParts/ASTNode';

describe('default ASTNode', () => {
    let node = new ASTNode([], function () {
        return 2;
    });
    
    test("default ASTNode should have no Error on inputs", () => {
        for (let value in node.getErrors()) {
            expect(value).toBe(false);
        }
    });

    test("inputs should be empty in a default ASTNode", () => {
        expect(node.getInputs()).toHaveLength(0);
    });

    test("errors should be empty in a default ASTNode", ()=>{
        expect(node.getErrors()).toHaveLength(0);
    })
});

describe("ASTNode getters and setters",()=>{
    let node1 = new ASTNode([],function(){
        return 0;
    })
    let node2 = new ASTNode([],function(){
        return 0;
    })
    let output = new ASTNode([node1,node2],function(){
        this.inputs[0] * this.inputs[1];
    });
    let length:number = 2;

    test("connected node should have errors array and inputs array be the same length",()=>{
        expect(output.getInputs()).toHaveLength(length);
        expect(output.getErrors()).toHaveLength(length);
    });
    test("setErrorFlag/clearErrorFlag correctly sets the index",()=>{
        let index:number = Math.floor((Math.random() * length));
        expect(output.getErrors()[index]).toBe(false);
        output.setErrorFlag(index);
        expect(output.getErrors()[index]).toBe(true);
        output.clearErrorFlag(index);
        expect(output.getErrors()[index]).toBe(false);
    });
});
