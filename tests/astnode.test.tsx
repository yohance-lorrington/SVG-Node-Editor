
import ASTNode from '../src/componenets/NodeEditor/Node';

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


    
})