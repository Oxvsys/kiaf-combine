import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/@core/services/auth.service';
import { User } from 'src/app/@data/user.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {

  constructor(private authService: AuthService, private http: HttpClient,private toastr:NbToastrService) { }
  loading = false;
  user: User | null = null;
  selectedFile: File | undefined;
  imageSrc: any = '';
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser2();
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(event.target.files[0]);

  }
  onUpload() {
    // this.http is the injected HttpClient
    if (this.selectedFile && this.user) {
      this.loading = true;
      const uploadData = new FormData();
      uploadData.append('profile_image', this.selectedFile, this.selectedFile.name);
      uploadData.append('name', this.user.name);
      this.http.put(environment.apiUrl + '/user/profile/', uploadData, { reportProgress: true, observe: 'events' })
        .subscribe(
        next => {console.log(next);},
        err=>console.log,
        () => {
          this.loading = false;
          this.toastr.success('Profile Update Complete','Profile successfully updated',{duration:5000});
          this.authService.refreshToken().subscribe(next => console.log(next));
        }
        );
    }
  }
}
