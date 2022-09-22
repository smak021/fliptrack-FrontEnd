import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilmComponent } from './film/film.component';
import { TrackComponent } from './track/track.component';
import { FooterComponent } from './footer/footer.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'film/:id',component:FilmComponent},
  {path:'topfive',component:TrackComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
