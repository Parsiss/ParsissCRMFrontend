import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventInfo, event_type_map } from '../../interfaces';
import * as moment from "jalali-moment";
import { MatDialog } from '@angular/material/dialog';
import { EventEditDialogComponent } from '../event-edit-dialog/event-edit-dialog.component';
import { DataService } from '../../data.service';
import { Observable, of } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


interface FlatEventInfoNode {
  expandable: boolean;
  event: EventInfo;
  level: number;
}


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnChanges {
  @Input() public events: EventInfo[];
  @Input() public device_id: number;

  public dragging: EventInfo | null = null;

  @Output() public updated = new EventEmitter<number>();

  public event_type_map = event_type_map;

  private _transformer = (node: EventInfo, level: number) => {
    return {
      event: node,
      level: level,
      expandable: node.can_have_children
    };
  };

  constructor(
    public dialog: MatDialog,
    public dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  treeControl = new FlatTreeControl<FlatEventInfoNode>(
    node => node.level,
    node => node.expandable
  );
  
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatEventInfoNode) => node.expandable;
  
  formatDate(datetime: Date): string {
    let date = moment(datetime).format("jYYYY/jMM/jDD")
    return date;
  }

  openDialog(): void {
    let dialog = this.dialog.open(EventEditDialogComponent, {direction: 'rtl', data: {device_id: this.device_id}});
    dialog.componentInstance.enableEdit();
    dialog.afterClosed().subscribe((data: EventInfo) => {
      let file = data && (data as any)['file'];
      let result = (data ? this.dataService.addEvent(data) : null);
      result?.subscribe((data: EventInfo) => {
        this.addFile(file, data).subscribe(this.updated.emit.bind(this.updated));
      });
    });
  }

  tableRowCliecked(row: EventInfo): void {
    let dialog = this.dialog.open(EventEditDialogComponent, {direction: 'rtl', data: row});
    dialog.afterClosed().subscribe((data: EventInfo) => {
      let file = data && (data as any)['file'];
      let result = (data ? this.dataService.updateEvent(data) : null);
      result?.subscribe((data: EventInfo) => {
        this.addFile(file, data).subscribe(this.updated.emit.bind(this.updated));
      });
    });
    
    dialog.componentInstance.deleted.subscribe(() => {
      this.events = this.events.filter((event) => event.id != row.id);
      this.dataSource.data = this.events;
    });
  }

  addFile(file: FormData, data: EventInfo): Observable<any> {        
    if(file) {
      file = (file as FormData);
      file.append("device_id", this.device_id.toString());
      file.append("event_id", data.id.toString());
      file.append("type", "MC")
      return this.dataService.addFile(file);
    }
    return of('ok!');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if(changes['events']) {
      this.dataSource.data = this.events;
    }
  }


  dragStart(event: DragEvent, row: FlatEventInfoNode) {
    this.dragging = row.event;
  }

  dragOver(event: DragEvent, row: FlatEventInfoNode) {
    event.preventDefault();
    this.treeControl.expand(row);
  }


  drop(drop_event: DragEvent, row: FlatEventInfoNode) {
    drop_event.preventDefault();
    if(this.dragging) {
      let dragging = this.dragging;
      dragging.parent_id = row.event.id;

      this.dataService.updateEvent(dragging).subscribe(() => {
        row.event.children.push(dragging);
        this.events = this.events.filter((event) => event.id != dragging.id);
        this.dataSource.data = this.events;
      });
    }
  }
}
