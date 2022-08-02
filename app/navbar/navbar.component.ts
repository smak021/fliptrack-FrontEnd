import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isdisplay:boolean=false
  searchData:any;
  constructor(private router: Router) { }


  onSave(home:string){
    this.router.navigateByUrl(home);
  }
  ngOnInit(): void {
    
    this.url="assets/logo.png";
   
    // console.log(search);
    
  }

  toggleMenu(){
    let vv = document.getElementById("menuoptions");
    if(vv!=null && this.isdisplay ==false)
    {
    vv.style.display = "flex";
    this.isdisplay = true;
    }
    else if(vv!=null && this.isdisplay==true){
      vv.style.display = "none"
      this.isdisplay = false
    }
  }


  isSticky: boolean = true;
  isFalse:boolean=true;
  url:string="assets/logo.png";

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if(window.scrollY==0)
    {
      this.isFalse=false;
      this.url="assets/logo.png";
    }
    else{
    this.isFalse = true;
    this.url="assets/logo2.png";
  }
    this.isSticky = window.pageYOffset >= 0;
  }

  processAjaxData(event: Event){
    this.searchData = (event.target as HTMLInputElement).value;
    
    // window.history.pushState({},"", "search="+data);
}

}
