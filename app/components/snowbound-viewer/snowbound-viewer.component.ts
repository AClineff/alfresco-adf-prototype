import {Component, Input, AfterViewInit} from '@angular/core';
import {AlfrescoSettingsService, AlfrescoAuthenticationService} from "ng2-alfresco-core";
import {DomSanitizationService} from '@angular/platform-browser';

declare let __moduleName:string;

@Component({
    moduleId: __moduleName,
    selector: 'snowbound-viewer',
    template: `
        <iframe width="100%" height="100%" [src]="viewerURL()"></iframe>   
`
})
export class SnowboundViewerComponent{
    // The document id used to source the viewer documentId argument
    @Input()
    fileNodeId: string;

    // The root URL constructed through the ECM host url and snowbound specific arguments
    rootURL: string;

    // url provided to the iframe
    url:string;

    // Initialize the alfrescoSettingsService, build the root URL
    constructor(public alfrescoSettingsService: AlfrescoSettingsService,
                public authenticationService: AlfrescoAuthenticationService,
                public sanitizer: DomSanitizationService) {
        console.debug("Constructor running");
        this.rootURL = this.getECMHost() + "/VirtualViewerJavaHTML5/index.html";
    }

    viewerURL(){
        console.debug("Running viewerURL()");
        let args = '{"ticket" : "' + this.authenticationService.getTicketEcm() + '"}';
        this.url= this.rootURL + "?documentId=" + this.fileNodeId + '&clientInstanceId=' + args;
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }

    private getECMHost(){
        return this.alfrescoSettingsService.ecmHost;
    }
}
