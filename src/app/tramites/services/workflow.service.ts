import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParticipantesWorkflowModel, WorkflowModel } from '../models/worflow.model';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  constructor(private http: HttpClient) { }


  addWorkflow(workflow: WorkflowModel) {
    return this.http.post(`${base_url}/workflow`, workflow)
  }
  getWorkflow(id_tramite: number) {
    return this.http.get<{ ok: boolean, workflow: WorkflowModel[], participantes: ParticipantesWorkflowModel[] }>(`${base_url}/workflow/${id_tramite}`).pipe(
      map(resp => {
        return { workflow: resp.workflow, participantes: resp.participantes }
      }))
  }
}
