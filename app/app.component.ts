/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import {
  MDL,
  AlfrescoSettingsService,
  AlfrescoTranslationService,
  AlfrescoPipeTranslate,
  AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

import { SearchBarComponent } from './components/index';

declare var document: any;

@Component({
  selector: 'alfresco-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  directives: [SearchBarComponent, ROUTER_DIRECTIVES, MDL],
  pipes: [AlfrescoPipeTranslate]
})
export class AppComponent {
  translate: AlfrescoTranslationService;
   searchTerm: string = '';

  ecmHost: string = 'http://127.0.0.1:8080';
  bpmHost: string = 'http://127.0.0.1:9999';

  constructor(public auth: AlfrescoAuthenticationService,
              public router: Router,
              translate: AlfrescoTranslationService,
              public alfrescoSettingsService: AlfrescoSettingsService) {
    this.setEcmHost();
    this.setBpmHost();

    this.translate = translate;
    this.translate.addTranslationFolder();
  }

  public onChangeECMHost(event: KeyboardEvent): void {
    console.log((<HTMLInputElement>event.target).value);
    this.ecmHost = (<HTMLInputElement>event.target).value;
    this.alfrescoSettingsService.ecmHost = this.ecmHost;
    localStorage.setItem(`ecmHost`, this.ecmHost);
  }

  public onChangeBPMHost(event: KeyboardEvent): void {
    console.log((<HTMLInputElement>event.target).value);
    this.bpmHost = (<HTMLInputElement>event.target).value;
    this.alfrescoSettingsService.bpmHost = this.bpmHost;
    localStorage.setItem(`bpmHost`, this.bpmHost);
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  onLogout(event) {
    event.preventDefault();
    this.auth.logout()
      .subscribe(
        () => this.router.navigate(['/login'])
      );
  }


  onToggleSearch(event) {
    let expandedHeaderClass = 'header-search-expanded',
      header = document.querySelector('header');
    if (event.expanded) {
      header.classList.add(expandedHeaderClass);
    } else {
      header.classList.remove(expandedHeaderClass);
    }
  }


  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  hideDrawer() {
    // todo: workaround for drawer closing
    document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
  }

  private setEcmHost() {
    if (localStorage.getItem(`ecmHost`)) {
      this.alfrescoSettingsService.ecmHost = localStorage.getItem(`ecmHost`);
      this.ecmHost = localStorage.getItem(`ecmHost`);
    } else {
      this.alfrescoSettingsService.ecmHost = this.ecmHost;
    }
  }

  private setBpmHost() {
    if (localStorage.getItem(`bpmHost`)) {
      this.alfrescoSettingsService.bpmHost = localStorage.getItem(`bpmHost`);
      this.bpmHost = localStorage.getItem(`bpmHost`);
    } else {
      this.alfrescoSettingsService.bpmHost = this.bpmHost;
    }
  }
}
