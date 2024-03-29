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

import { provideRouter, RouterConfig } from '@angular/router';

import {
    SearchComponent,
    FilesComponent,
    ActivitiDemoComponent,
    ChartComponent,
    LoginDemoComponent,
    DoctreeComponent
} from './components/index';

export const routes: RouterConfig = [
    { path: 'home', component: DoctreeComponent },
    { path: 'search', component: SearchComponent },
    { path: 'files', component: FilesComponent },
    { path: 'activiti', component: ActivitiDemoComponent },
    { path: 'chart', component: ChartComponent },
    { path: '', component: LoginDemoComponent },
    { path: 'login', component: LoginDemoComponent },
    { path: 'doctree', component: DoctreeComponent}
];

export const appRouterProviders = [
    provideRouter(routes)
];
