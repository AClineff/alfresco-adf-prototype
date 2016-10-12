import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { TreeView } from './tree-view.component';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';
import {DOCUMENT_LIST_PROVIDERS, DocumentListService} from 'ng2-alfresco-documentlist';
import {DoctreeService} from "./doctree.service";
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
    providers: [ DoctreeService ]
})
export class DoctreeComponent implements OnInit, AfterViewInit {

    rootPath: string = '/Sites/mra/medicalRecords/';

    doctreeService: DoctreeService;

    tabs: Array<any>;

    selectedTab: any;

    // An array of folders/files to supply to the root of the doctree
    nodes: Array<any>;

    // The nodeId of the currently selected node for propagating through the tree to highlight said item
    highlightedNode: string = '';

    // fileNodeId to supply to the viewer TODO Probably merge with highlightedNode?
    fileNodeId: any;

    patient: any;

    // tabColors: Array<string> = ['red', 'blue', 'green', 'orange', 'yellow'];
    tabColors: Array<string> = ['255,0,0', '0,0,255', '0,128,0', '255,140,0', '255,255,0'];
    tabBackgroundOpacity = '0.5';

    @ViewChild(PatientSelector) patientSelector: PatientSelector;

    /**
     * @constructor
     * @desc Initializes an instance of list-service and uses it to fetch the top-level list of entities.
     *  See ng2 docs for why this constructor constructs service instance vs static service.
     * @param listService node_modules/ng2-alfresco-document-list/dist/src/services/document-list.service.js
     */
    constructor(doctreeService: DoctreeService) {
        this.doctreeService = doctreeService;
    }

    ngOnInit():any {
        let doctreeService = this.doctreeService;
        // let folderStream = listService.getFolder('/Sites/swsdp/documentLibrary/Agency Files');
        let fs2 = doctreeService.getFolder(this.rootPath, { include: ['properties']});

        // Simplest manipulation of Observable stream, do something when the list of entities comes in.
        // folderStream.subscribe(
        //     resp => {
        //         this.nodes  = resp.list.entries;
        //     }
        // );

        fs2.subscribe(
            resp => {
                this.tabs = resp.list.entries;
                this.selectedTab = this.tabs[0];
                this.onTabClick(this.selectedTab);
                console.debug('', this.tabs);
            }
        )
    }

    ngAfterViewInit():any {
        this.onHeaderButtonClick();
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
        this.doctreeService.getFolder(this.rootPath + this.selectedTab.entry.name, {include: ['properties']} ).subscribe(
            resp => {
                this.nodes  = resp.list.entries;
                console.debug('', this.nodes);
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

    getTabBorderColor(index, tab):string{
        let length = this.tabColors.length;
        let modded_i = index%length;
        if(this.selectedTab == tab) return 'rgb(255, 152, 0)';
        return 'rgb(' + this.tabColors[modded_i] + ')';
    }

    getTabBackgroundColor(index):string{
        let length = this.tabColors.length;
        let modded_i = index%length;
        return 'rgba(' + this.tabColors[modded_i] +  ',' + this.tabBackgroundOpacity + ')';
    }
}
