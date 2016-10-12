import {Component, Input, AfterViewInit} from '@angular/core';
import {AlfrescoSettingsService} from "ng2-alfresco-core";

declare let __moduleName:string;

@Component({
    moduleId: __moduleName,
    selector: 'snowbound-viewer',
    template: `
        <iframe *ngIf="url" width="100%" height="300" [src]="url"></iframe>   
`
})
export class SnowboundViewerComponent{
    // The document id used to source the viewer documentId argument
    @Input fileNodeId: string;

    // The root URL constructed through the ECM host url and snowbound specific arguments
    rootURL: string;

    // url provided to the iframe
    url:string;

    // Initialize the alfrescoSettingsService, build the root URL
    constructor(public alfrescoSettingsService: AlfrescoSettingsService) {
        this.rootURL = this.getECMHost() + "/VirtualViewerJavaHTML5/index.html";
        this.url= this.rootURL + "/documentId=" + this.fileNodeId;
    }

    private getECMHost(){
        return this.alfrescoSettingsService.ecmHost;
    }
}
