import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { FarmerService } from '../create-farmer/farmer.service';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

(<any>pdfMake).fonts = {
  Mukta: {
    normal: "https://fonts.cdnfonts.com/s/15717/Mukta-Regular.woff",
    bold: "https://fonts.cdnfonts.com/s/15717/Mukta-Bold.woff",
  }

}
import { FarmerData } from './farmer.interface';
import { getPDFMakeDocument } from './farmer-pdf-document';
import { AuthService } from 'src/app/@core/services/auth.service';
import { USER_TYPE } from 'src/app/@data/user.interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-view-farmers',
  templateUrl: './view-farmers.component.html',
  styleUrls: ['./view-farmers.component.scss'],
  providers: [FarmerService]
})

export class ViewFarmersComponent implements OnInit {

  currentPage = 1;
  searchText = "";
  showSearchBar = false;
  paginationSubject = new BehaviorSubject(this.currentPage);
  searchSubject = new BehaviorSubject(this.searchText);
  loading = false;
  loadingId = 0;

  constructor(
    private farmService: FarmerService,
    private dialogService: NbDialogService,
    private auth: AuthService,
    private router: Router
  ) { }
  // farmers$ = this.paginationSubject.asObservable().pipe(
  //   switchMap((pageNo) => this.farmService.getAllFarmers(pageNo))
  // );

  user$ = this.auth.getCurrentUser();
  userType = USER_TYPE;
  farmers$ = combineLatest([this.paginationSubject, this.searchSubject])
    .pipe(distinctUntilChanged((prev, curr) => prev[0] == curr[0] && prev[1] == curr[1]))
    .pipe(
      switchMap(([pageNo, searchFiled]) => this.farmService.getAllFarmers(pageNo, searchFiled))
    )

  ngOnInit(): void {
  }

  showFarmerDetail(dialog: TemplateRef<any>, farmer: FarmerData) {
    this.dialogService.open(dialog, { context: farmer });
  }

  onPageChange(pageNo: number) {
    if (this.currentPage != pageNo) {
      this.currentPage = pageNo;
      this.paginationSubject.next(pageNo);
    }
  }

  search() {
    this.showSearchBar = false;
    this.paginationSubject.next(1);
    this.searchSubject.next(this.searchText);
  }
  clearSearch() {
    // this.showSearchBar=false;
    this.searchText = "";
    this.searchSubject.next(this.searchText);
  }

  generatePDF(farmerData: FarmerData) {
    this.loading = true;
    this.loadingId = farmerData.id;
    console.log('downloading...!')
    pdfMake.createPdf(getPDFMakeDocument(farmerData)).download(farmerData.first_name + '_' + farmerData.fathers_name + '_' + farmerData.family_name + '_' + farmerData.created_at, () => {
      console.log('PDF download successfully!');
      this.loading = false;
    });
  }

  toggleFarmer(id: number, discard: boolean) {
    this.farmService.toggleFarmerForm(id, discard).subscribe(next => {

    });
  }

  goToRequestOtp(data: any, ref: any) {
    ref.close();
    this.router.navigateByUrl('/dashboard/request-otp', { state: data });
  }


}
