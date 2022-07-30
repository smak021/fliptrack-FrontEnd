import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor(private router: Router) { }


  onSave(home:string){
    this.router.navigateByUrl(home);
  }
  ngOnInit(): void {

    

  }

  isSticky: boolean = false;
  isFalse:boolean=false;
  url:string="../../assets/logo.png";

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if(window.scrollY==0)
    {
      this.isFalse=false;
      this.url="../../assets/logo.png";
    }
    else{
    this.isFalse = true;
    this.url="../../assets/logo2.png";
  }
    this.isSticky = window.pageYOffset >= 0;
  }

}
