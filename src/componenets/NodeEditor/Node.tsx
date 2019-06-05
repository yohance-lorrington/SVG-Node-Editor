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
    setErrorFlag(index: number):void{
        this.errors[index] = true;
    }
    clearErrorFlag(index: number):void{
        this.errors[index] = false;
    }
    setInputs(inputs: ASTNode[]):void{
        this.inputs = inputs;
    }
    setResolveFunction(resolveFunc: Function):void{
        this.resolve = resolveFunc;
    }
    getInputs(): Array<ASTNode> {
        return this.inputs;
    }
    getErrors(): Array<Boolean> {
        return this.errors;
    }
}