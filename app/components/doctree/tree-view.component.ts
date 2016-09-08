import { Component, Input, Output, EventEmitter } from '@angular/core';
import {DocumentListService} from 'ng2-alfresco-documentlist';

/**
 * @class TreeView
 * @classdesc Component using a recursive directive to construct a tree of arbitrary size and depth given an input of entities
 */
@Component({
    selector: 'tree-view',
    template: `
        <ul style="list-style:none">
            <li *ngFor="let node of nodes" class="{{highlightedClass(node)}}">
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
        .tree-view-li-highlighted {
            background-color: red;
        }
    `],
    directives: [TreeView]
})
export class TreeView {
    @Input() nodes: Array<any>;
    @Input() highlightedNode: string;
    @Output() selectedNode = new EventEmitter();

    listService: DocumentListService;

    constructor(listService: DocumentListService){
        this.listService = listService;
    }

    onItemClick(node){
        if( this.isFolder(node)) this.toggle(node);
        else this.selectedNode.emit(node.entry.id);
    }

    nodeSelected(nodeId){
        this.selectedNode.emit(nodeId);
    }

    isFolder(node){
        return node.entry.isFolder;
    }

    toggle(node){
        if(node.expanded){
            node.expanded = false;
            return;
        }

        if(node.children){
            node.expanded = true;
            return;
        }

        let currentPath = '';
        for(let i = 1; i < node.entry.path.elements.length ; i++){
            currentPath+= '/' + node.entry.path.elements[i].name;
        }
        let newPath = currentPath + '/' + node.entry.name;
        let folderStream = this.listService.getFolder(newPath);
        folderStream.subscribe(
            resp => {
                console.debug(resp);
                node.children  = resp.list.entries;
            }
        );
        node.expanded = true;
    }

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
