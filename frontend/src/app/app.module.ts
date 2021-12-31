import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { AppHeadComponent } from './app-head/app-head.component';
import { AppFootComponent } from './app-foot/app-foot.component';
import { newUserComponent } from './newUser/newUser.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostViewComponent } from './post-view/post-view.component';
import { Userservice } from './services/user.service';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UserInterfaceComponent } from './user-interface/user-interface.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'
import { Postservice } from './services/posts.service';
import { Commentservice } from './services/comments.service';
registerLocaleData (localeFr,'fr')

@NgModule({
  declarations: [
    AppComponent,
    AppHeadComponent,
    AppFootComponent,
    newUserComponent,
    PostsListComponent,
    PostViewComponent,
    LoginComponent,
    UserInterfaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [Userservice,AuthService,Postservice,Commentservice],
  bootstrap: [AppComponent]
})
export class AppModule { }
