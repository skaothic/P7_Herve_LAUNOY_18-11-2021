import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { newUserComponent } from './newUser/newUser.component';
import { PostViewComponent } from './post-view/post-view.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { UserInterfaceComponent } from './user-interface/user-interface.component';

const routes: Routes = [
  {path:'newUser',component:newUserComponent},
  {path:'posts',component:PostsListComponent},
  {path:'posts/:id',component:PostViewComponent},
  {path:'login',component:LoginComponent},
  {path:'user/current',component:UserInterfaceComponent},
  {path:'**',component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
