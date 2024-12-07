import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShowsService } from './services/shows.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Show } from './models/show.model';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  isModalOpen : boolean = false;
  isEditModalOpen: boolean = false;
  shows: Show[] = [];
  showId!: string | undefined;

  $sub = new Subject<void>;

  addShowFormGroup : FormGroup = this._formBuilder.group({
    title: [''],
    description: [''],
    nbrOfEpisodes: [0],
  })

  editShowFromGroup : FormGroup = this._formBuilder.group({
    title: [''],
    description: [''],
    nbrOfEpisodes: [0],
  })

  ngOnInit(): void {
      this.getShows();
  }

  constructor(private _showService: ShowsService, private _formBuilder: FormBuilder) {

  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(showId: string | undefined) {
    this.isEditModalOpen = true;
    this.showId = showId;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  addShow() {
    if(this.addShowFormGroup.valid) {
      this._showService.addShow(this.addShowFormGroup.value).subscribe({
        next: show => console.log(show),
        error: err => console.log(err),
      })
    }
  }

  getShows() {
    this._showService.getShows()
    .pipe(
      tap(shows => console.log(shows)),
      takeUntil(this.$sub)
    )
    .subscribe({
      next: shows => this.shows = shows,
      error: err => console.log(err)
    })
  }

  deleteShow(showId: string | undefined) {
    this._showService.deleteShow(showId)
    .subscribe({
      next: () => {
        console.log(`Show with ID ${showId} deleted.`);
        this.shows = this.shows.filter(show => show.id !== showId);
      },
      error: err => console.log(`error deleting user with id : ${showId} `)
    })
  }

  editShow() {
    if(this.editShowFromGroup.valid){
      this._showService.editShow(this.showId, this.editShowFromGroup.value)
      .subscribe({
        next: updatedShow => {
          const index = this.shows.findIndex(show => show.id === this.showId);
          if (index !== -1) {
            this.shows[index] = updatedShow;
          }
        }
      })
    }
  }

  ngOnDestroy(): void {
      this.$sub.next();
  }
}
