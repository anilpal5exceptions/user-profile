import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; 
import { Router } from '@angular/router';
declare let bootstrap: any;

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {

  userForm!: FormGroup;
  allUser:Array<any> = []
  editMode: boolean = false;
  selectedUserId: number | null = null;
  paginatedUsers: any[] = []; // Users to display for the current page
  itemsPerPage: number = 5; // Number of users per page
  currentPage: number = 1; // Current page number
  totalPages: number = 0;
  searchTerm: string = '';
  isFilter:boolean = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.getAllUserList();

    this.totalPages = Math.ceil(this.allUser.length / this.itemsPerPage); // Calculate total pages
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.allUser.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  filterUsers(): any[] {
    return this.allUser.filter(user => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return user.name.toLowerCase().includes(searchTermLower) || user.email.toLowerCase().includes(searchTermLower);
    });
  }
  onSearchChange(searchValue: string): void {
    this.searchTerm = searchValue;
    this.currentPage = 1; // Reset to the first page when searching
    this.updatePagination();
  }

  createForm(){
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      technology: ['', Validators.required],
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address:['', Validators.required], 
      pin:['', Validators.required],
      phone:['', Validators.required],
      designation:['', Validators.required]  
    });
  }

  userDeatils(user:any){
    this.router.navigate(['/user-profile', user.id]);
  }

  onEdit(user: any): void {
    this.editMode = true;
    this.selectedUserId = user.id;

    // Populate form with user data
    this.userForm.patchValue({
      name: user.name,
      technology: user.technology,
      companyName: user.companyName,
      email: user.email,
      address: user.address, 
      pin: user.pin, 
      phone: user.phone,
      designation: user.designation,
    });

    // Open the modal programmatically
    const modalElement = document.getElementById('exampleModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else { 
  
      const formData = this.userForm.value;  // Store form data for reuse
      
      if (this.editMode) {
        // Edit mode - Update the user
        this.userService.updateUser(this.selectedUserId, formData).subscribe({
          next: (data) => { 
            Swal.fire({
              position: "center",
              icon: "success",
              title: "User has been Updated",
              showConfirmButton: false,
              timer: 1500
            });
  
            // Reset the form and UI
            this.userForm.reset();
            this.editMode = false; // Reset edit mode
            this.selectedUserId = null; // Clear selected user
            
            // Refresh the user list
            this.getAllUserList(); 
            window.location.reload();
          },
          error: (err) => {
            this.editMode = false;
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err?.error?.message || "Something went wrong! Please try again later."
            });
            window.location.reload();
          }
        });
      } else {
        // Create mode - Add new user
        this.userService.saveUser(formData).subscribe({
          next: (data) => { 
            Swal.fire({
              position: "center",
              icon: "success",
              title: "User has been Created",
              showConfirmButton: false,
              timer: 1500
            });
  
            // Reset the form
            this.userForm.reset();
  
            // Refresh the user list
            this.getAllUserList();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err?.error?.message || "Something went wrong! Please try again later."
            });
          }
        });
      }
    }
  }
  
  toggleFilter():void {
    this.isFilter = !this.isFilter;
  }

  getAllUserList(event?: any) {
    this.userService.getUsersList().subscribe((data) => {
      let eventValue = '';
  
      // Check if event is provided (i.e., it's a search action)
      if (event) {
        eventValue = event.target.value.toLowerCase(); // Convert search input to lowercase for case-insensitive search
  
        // Filter users based on name or email
        this.allUser = data
          .filter((el) => {
            return (
              el.name.toLowerCase().includes(eventValue) || // Case-insensitive match for name
              el.email.toLowerCase().includes(eventValue)   // Case-insensitive match for email
            );
          })
          .reverse(); // Reverse the filtered list
      } else {
        // If no search event, just return all users in reverse order
        this.allUser = data.reverse(); 
      }
    });
  }
  
  

  onDelete(userId: number, event: Event): void {
    event.preventDefault(); // Prevent default link behavior
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteuser(userId).subscribe({
          next: () => {
            Swal.fire({
              title: "Deleted!",
              text: "The user has been deleted.",
              icon: "success"
            });
            this.getAllUserList();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete the user. Please try again later."
            });
          }
        });
      }
    });
  }

}
