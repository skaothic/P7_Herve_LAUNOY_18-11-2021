import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-head',
  templateUrl: './app-head.component.html',
  styleUrls: ['./app-head.component.scss']
})
export class AppHeadComponent implements OnInit {

  constructor(public authservice:AuthService) { 
  }

  ngOnInit(): void {   

  }


logOut(){
  this.authservice.signOut()
}
}
