import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  id:any;
  userData:any;

  constructor(
    private readonly actRoute : ActivatedRoute,
    private readonly userService: UserService,
    private readonly router: Router

  ) { }

  ngOnInit() {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    console.log('User ID from URL:', this.id);

    this.userService.getUserById(this.id).subscribe(data => {
     this.userData = data;
     console.log('User ID from URL:', this.userData);
    })
  }

  goBack():void {
    this.router.navigate([''])
  } 



}