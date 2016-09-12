import { Component, Input, Output, EventEmitter } from '@angular/core';
import {DocumentListService} from 'ng2-alfresco-documentlist';

/**
 * @class TreeView
 * @classdesc Component using a recursive directive to construct a tree of arbitrary size and depth given an input of entities
 */
@Component({
    selector: 'tree-view',
    template: `
        <ul class="mra-list" style="list-style:none">
            <li *ngFor="let node of nodes" class="mra-list__item {{highlightedClass(node)}}">
                <span (click)="onItemClick(node)"> <i class="material-icons">{{isFolder(node) ? 'folder' : 'description'}}</i> {{node.entry.name}}</span>
                <span *ngIf="node.expanded">
                    <tree-view [nodes]="node.children" [highlightedNode]="highlightedNode" (selectedNode)="nodeSelected($event)">Loading...</tree-view>
                </span>
            </li>
        </ul>
    `,
    styles: [ `   
        li {
            cursor: pointer;
        }
        .mra-list__item {
            padding: 0 16px;
            align-items:center;
            box-sizing: border-box;
        }
        .tree-view-li-highlighted {
           background-color: #fafafa;
        }
    `],
    directives: [TreeView]
})
export class TreeView {
    // Nodes in this level of the tree.
    @Input() nodes: Array<any>;

    // ID of node to be highlighted, checked against nodes in this level.
    @Input() highlightedNode: string;

    // Event emitter for when a user clicks on an item
    @Output() selectedNode = new EventEmitter();

    // alfresco DocumentListService service that we use to handle our API calls.
    listService: DocumentListService;

    /**
     * @constructor
     * @desc instantiates instance of DocumentListService
     * @param listService
     */
    constructor(listService: DocumentListService){
        this.listService = listService;
    }

    /**
     * This handles a user clicking on folders or items in the tree.
     * @param node Node clicked.
     */
    onItemClick(node){
        if( this.isFolder(node)) this.toggle(node);
        else this.selectedNode.emit(node.entry.id);
    }

    /**
     * This handles children that have been selected, passes it up the tree.
     * @param nodeId string
     */
    nodeSelected(nodeId){
        this.selectedNode.emit(nodeId);
    }

    /**
     * Returns true if the node has children
     * @param node
     * @returns {(node:any)=>(node:any)=>any}
     */
    isFolder(node){
        return node.entry.isFolder;
    }

    /**
     *
     * @param node
     */
    toggle(node){
        // Collapse expanded folders
        if(node.expanded){
            node.expanded = false;
            return;
        }

        // If it already has a children property, just toggle the expanded property.
        if(node.children){
            node.expanded = true;
            return;
        }

        // Else the node is a folder but has unfetched children, so we fetch them.
        // We build the path by hand because the Alfresco Path property doesn't actually work.
        let currentPath = '';
        for(let i = 1; i < node.entry.path.elements.length ; i++){
            //noinspection TypeScriptUnresolvedVariable
            currentPath+= '/' + node.entry.path.elements[i].name;
        }
        let newPath = currentPath + '/' + node.entry.name;

        // getFolder returns Observable, which we subscribe to and handle the response.
        let folderStream = this.listService.getFolder(newPath);
        folderStream.subscribe(
            resp => {
                node.children  = resp.list.entries;
            }
        );
        node.expanded = true;
    }

    /**
     * There's probably a more angular 2.0 way to accomplish this...
     * @param node
     * @returns {string}
     */
    highlightedClass(node){
        if(this.highlightedNode){
            if(node.entry.id == this.highlightedNode){
                return 'tree-view-li-highlighted'
            }
            return '';
        }
        return '';
    }
}
