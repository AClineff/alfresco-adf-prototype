import {Component} from '@angular/core';
import { TreeView } from './tree-view.component';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';
import {DOCUMENT_LIST_PROVIDERS, DocumentListService} from 'ng2-alfresco-documentlist';

declare let __moduleName:string; //TODO Ask someone what this does.

/**
 * @class DoctreeComponent
 * @classdesc Parent component for the medical records app.  Template/Directives for the tree view and viewer.
 */
@Component({
    moduleId: __moduleName,
    selector: 'doctree-component',
    templateUrl: 'doctree.component.html',
    styleUrls: ['doctree.component.css'],
    directives: [ TreeView, VIEWERCOMPONENT ],
    providers: [ DOCUMENT_LIST_PROVIDERS ]
})
export class DoctreeComponent {

    // An array of folders/files to supply to the root of the doctree
    nodes: Array<any>;

    // The nodeId of the currently selected node for propagating through the tree to highlight said item
    highlightedNode: string = '';

    // fileNodeId to supply to the viewer TODO Probably merge with highlightedNode?
    fileNodeId: any = '723a0cff-3fce-495d-baa3-a3cd245ea5dc';

    // testlist
    tablist: Array<string> = ['Group 1', 'Group 2', 'Group 3'];

    /**
     * @constructor
     * @desc Initializes an instance of list-service and uses it to fetch the top-level list of entities.
     *  See ng2 docs for why this constructor constructs service instance vs static service.
     * @param listService node_modules/ng2-alfresco-document-list/dist/src/services/document-list.service.js
     */
    constructor(listService: DocumentListService) {
        // getFolder returns an Observable object
        let folderStream = listService.getFolder('/Sites/swsdp/documentLibrary');

        // Simplest manipulation of Observable stream, do something when the list of entities comes in.
        folderStream.subscribe(
            resp => {
                this.nodes  = resp.list.entries;
            }
        );
    }

    /**
     * @function nodeSelected
     * @desc Function fired on EventEmitter event selectedNode, see doctree.component.html
     * @param nodeId id of selected node.
     */
    nodeSelected(nodeId){
        this.fileNodeId = nodeId;
        this.highlightedNode = nodeId;
    }
}
