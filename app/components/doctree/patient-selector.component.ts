import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DocumentListService} from "ng2-alfresco-documentlist";
import {DoctreeService} from "./doctree.service";
import {Control} from "@angular/common";


declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'patient-selector',
    templateUrl: './patient-selector.component.html',
    styleUrls: ['./patient-selector.component.css'],
    providers: [DoctreeService]
})
export class PatientSelector implements OnInit{
    doctreeService: DoctreeService;

    dialog: any;

    patientPath: string = '/Sites/mra/patients/';

    patients: Array<any>;

    filteredPatients: Array<any>;

    searchTerm: string;

    searchControl:any;

    @Output() selectedPatient = new EventEmitter();

    constructor(doctreeService: DoctreeService) {
        this.doctreeService = doctreeService;
        this.searchControl = new Control(this.searchTerm);

        let fs = doctreeService.getFolder(this.patientPath, { include: ['properties']});
        fs.subscribe(
            resp => {
                this.patients = this.filteredPatients = resp.list.entries;
            }
        );

        this.searchControl.valueChanges.map(value => value)
            .debounceTime(400).distinctUntilChanged().subscribe(
            (value:string) => {
                this.filteredPatients = this.patients.filter((patient:any) => {
                    if(!value) return true;
                    return patient.entry.name.toLowerCase().indexOf(value.toLowerCase()) >= 0;
                })
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
