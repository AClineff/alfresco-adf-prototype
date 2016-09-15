import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DocumentListService} from "ng2-alfresco-documentlist";
import {DoctreeService} from "./doctree.service";

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'patient-selector',
    templateUrl: './patient-selector.component.html',
    styleUrls: ['./patient-selector.component.css'],
    providers: [DoctreeService]
})
export class PatientSelector implements OnInit{
    dialog: any;

    patientPath: string = '/Sites/mra/patients/';

    patients: Array<string>;

    @Output() selectedPatient = new EventEmitter();

    constructor(listService: DocumentListService, doctreeService: DoctreeService) {
        let fs = doctreeService.getFolder(this.patientPath, { include: ['properties']});
        fs.subscribe(
            resp => {
                this.patients = resp.list.entries;
            }
        )
    }

    ngOnInit():any {
        this.dialog = document.querySelector('dialog');
    }

    onPatientSelect(patient){
        patient.name = patient.entry.name;
        this.selectedPatient.emit(patient);
        this.hideSelector();
    }

    showSelector(){
        this.dialog.showModal();
    }

    hideSelector(){
        this.dialog.close();
    }
}
