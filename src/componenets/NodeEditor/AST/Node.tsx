
export default class ASTNode{
    public resolve: Function;
    private inputs: ASTNode[];
    private errors: Boolean[];
    constructor(inputs:ASTNode[],resolveFunc: Function){
        this.inputs = inputs;
        this.resolve = resolveFunc;
        this.errors = [];
        for(let i = 0; i < this.inputs.length; i++){
            this.errors[i] = false;
        }
    }
    setErrorFlag(index: number){
        this.errors[index] = true;
    }
    clearErrorFlag(index: number){
        this.errors[index] = false;
    }
    setInputs(inputs: ASTNode[]){
        this.inputs = inputs;
    }
    setResolveFunction(resolveFunc: Function){
        this.resolve = resolveFunc;
    }
}