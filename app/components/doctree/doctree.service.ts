import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {
    AlfrescoAuthenticationService,
    AlfrescoContentService
} from 'ng2-alfresco-core';

declare let AlfrescoApi: any;

@Injectable()
export class DoctreeService {

    constructor(
        private authService: AlfrescoAuthenticationService,
        private contentService: AlfrescoContentService
    ) {}

    private getAlfrescoApi() {
        return this.authService.getAlfrescoApi();
    }

    private getNodesPromise(folder: string, opts?: any) {
        let nodeId = '-root-';
        let params: any = {
            relativePath: folder,
            include: ['path']
        };

        if (opts) {
           if(opts.include){
               params.include = opts.include.concat(params.include);
           }
        }

        return this.getAlfrescoApi().node.getNodeChildren(nodeId, params);
    }

    /**
     * Gets the folder node with the content.
     * @param folder Path to folder.
     * @param opts Options.
     * @returns {Observable<NodePaging>} Folder entity.
     */
    getFolder(folder: string, opts?: any) {
        return Observable.fromPromise(this.getNodesPromise(folder, opts))
            .map(res => res)
            // .do(data => console.log('Node data', data)) // eyeball results in the console
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error || 'Server error');
    }

}
