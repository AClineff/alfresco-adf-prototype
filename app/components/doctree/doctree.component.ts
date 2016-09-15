import {Component, ViewChild} from '@angular/core';
import { TreeView } from './tree-view.component';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';
import {DOCUMENT_LIST_PROVIDERS, DocumentListService} from 'ng2-alfresco-documentlist';
import {PatientSelector} from "./patient-selector.component";

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
    directives: [ TreeView, VIEWERCOMPONENT, PatientSelector ],
    providers: [ DOCUMENT_LIST_PROVIDERS ]
})
export class DoctreeComponent {

    rootPath: string = '/Sites/swsdp/documentLibrary/';

    listService: any;

    tabs: Array<any>;

    selectedTab: any;

    // An array of folders/files to supply to the root of the doctree
    nodes: Array<any>;

    // The nodeId of the currently selected node for propagating through the tree to highlight said item
    highlightedNode: string = '';

    // fileNodeId to supply to the viewer TODO Probably merge with highlightedNode?
    fileNodeId: any;

    patient: any;

    @ViewChild(PatientSelector) patientSelector: PatientSelector;

    /**
     * @constructor
     * @desc Initializes an instance of list-service and uses it to fetch the top-level list of entities.
     *  See ng2 docs for why this constructor constructs service instance vs static service.
     * @param listService node_modules/ng2-alfresco-document-list/dist/src/services/document-list.service.js
     */
    constructor(listService: DocumentListService) {
        this.listService = listService;
        // getFolder returns an Observable object
        let folderStream = listService.getFolder('/Sites/swsdp/documentLibrary/Agency Files');
        let fs2 = listService.getFolder(this.rootPath);

        // Simplest manipulation of Observable stream, do something when the list of entities comes in.
        folderStream.subscribe(
            resp => {
                this.nodes  = resp.list.entries;
            }
        );

        fs2.subscribe(
            resp => {
                this.tabs = resp.list.entries;
                this.selectedTab = this.tabs[0];
            }
        )
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

    patientSelected(patient){
        this.patient = patient;
        this.fileNodeId = '';
        this.highlightedNode = '';
        console.debug(patient);
    }

    onTabClick(tab){
        this.selectedTab = tab;
        this.listService.getFolder(this.rootPath + this.selectedTab.entry.name ).subscribe(
            resp => {
                this.nodes  = resp.list.entries;
            }
        )
    }

    isSelectedTab(tab){
        if(!tab) return false; //todo remove
        return tab.entry.name == this.selectedTab.entry.name;
    }

    onHeaderButtonClick(){
        this.patientSelector.showSelector();
    }
}
