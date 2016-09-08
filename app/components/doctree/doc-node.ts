/**
 * @class DocNode
 * @classdesc Object representing a node in the tree view.  Probably a wrapper for an actual alfresco node and/or unnecessary in the future.
 */
export class DocNode{
    name: string;
    children: Array<any>;
    expanded: boolean;
    leaf: boolean;

    /**
     * Builds the node and sets the leaf flag to true if there are no child nodes.
     * @param name Name of the folder/doc
     * @param children Array of child folders/docs
     */
    constructor(name: string, children?: Array<any>){
        this.name = name;
        this.leaf = false;
        children ? this.children = children : this.leaf = true;
    }

    /**
     * Tying the expanded logic to the model allows us to save state when changing parent nodes.
     */
    toggle(){
        this.expanded = !this.expanded;
    }

    /**
     * Simplifies code written in other parts of the app.
     * @returns {boolean}
     */
    isLeaf() {
        return this.leaf;
    }
}
