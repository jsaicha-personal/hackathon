import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { DatabaseService } from './../database.service';
import { procedures } from './../procedures';
import { procedure } from './../procedure';
import { dcodes } from './../dcodes';
import { dcodesingle } from './../dcode';
import { Apollo } from "apollo-angular";
import { Router, ActivatedRoute } from '@angular/router';

import gql from "graphql-tag";
// import { UITKCardModule } from '@uitk/angular';
// import {​​ MatButtonModule }​​ from '@angular/material/button';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {



  dcode: string = "";
  pcode: string = "";
  nodata: boolean = false;

  dcodesingleb: boolean = false;
  dcodesingle: dcodesingle[];
  showcard: boolean = false;
  spinner: boolean = false;
  dkeyword: string = "";
  progressbar: boolean = false;
  procedures: procedures[];
  procedure: procedure;
  finalprocedures: procedures[];
  dcodes: dcodes[];
  proceduresearch: boolean = false;
  intelligentswitch: boolean = false;
  nativeprocedure: boolean = false;

  constructor(private db: DatabaseService, private apollo: Apollo, private route: Router, private router: ActivatedRoute) { }

  ngOnInit(): void {
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  submit(dcode, dkeyword) {

    this.dcodes = [];
    this.procedures = [];
    this.dcodesingle = [];


    if (dcode) {


      this.spinner = true;
      this.apollo
        .query<any>({
          query: gql`
      query MyQuery {
        ICD10(where: {DIAG_CD: {_eq: "${dcode}"}}) {
          DIAG_CD
          FULL_DESC
        }
      }
      
      
      `
        })
        .subscribe(
          ({ data, loading }) => {
            this.spinner = false;



            this.dcodes = data.ICD10
            this.showcard = false;
            if (data.ICD10.length != 0) {
              this.showcard = true;
              this.nodata = false;
            } else {
              this.nodata = true;
              this.showcard = false;
            }

            console.log("this is the ICD10 data from code search =>", data);
            console.log("this is the loading =>", data.ICD10.length);
          }
        );


    }

    else {
      this.spinner = true;
      this.apollo
        .query<any>({
          query: gql`
          query MyQuery {
            ICD10_KEY_WRD(where: {KEY_WRD: {_similar: "${dkeyword}"}}) {
              Keyword_to_full_desc {
                DIAG_CD
                FULL_DESC
              }
            }
          }
          
    
    
    `
        })
        .subscribe(
          ({ data, loading }) => {
            this.dcodesingle = [];
            this.spinner = false;
            this.dcodesingle = data.ICD10_KEY_WRD
            if (data.ICD10_KEY_WRD.length == 0) {
              this.nodata = true;
              this.showcard = false;
            } else {
              this.nodata = false;

            }


            console.log("this is the icd 10 data from keyword serach =>", this.dcodesingle);
            console.log("this is the loading =>", loading);
          }
        );
    }

  }
  getprocedures(dcode) {
    this.progressbar = true;
    this.apollo
      .query<any>({
        query: gql`
          query MyQuery {
            ICD10_CPT4_MAPPING(where: {DIAG_CD: {_eq: "${dcode}"}}) {
              PROC_CD
              cpt_full_desc_extraction {
                SHRT_DESC
              }
            }
          }
          
          
    
    `
      })
      .subscribe(
        async ({ data, loading }) => {
          this.procedures = [];
          await this.delay(1000);
          this.progressbar = false;
          this.intelligentswitch = true;
          this.procedures = data.ICD10_CPT4_MAPPING
          if (data.ICD10_CPT4_MAPPING.length == 0) {
            this.nodata = true;
          }
          else {
            this.nodata = false;

          }


          console.log("this is the cpt  data from serach =>", data);
          console.log("this is the loading =>", loading);
        }
      );
  }
  intelligentoff() {
    this.proceduresearch = !this.proceduresearch;
    this.procedures = [];

  }
  getprocedure(pcode) {
    this.progressbar = true;
    this.apollo
      .query<any>({
        query: gql`
        query MyQuery {
          CPT4(where: {PROC_CD: {_eq: "${pcode}"}}) {
            PROC_CD
            SHRT_DESC
          }
        }
        
        
        
        
  
  `
      })
      .subscribe(
        async ({ data, loading }) => {
          this.procedure = { PROC_CD: "", SHRT_DESC: "" };
          await this.delay(1000);
          this.progressbar = false;
          this.intelligentswitch = true;
          this.nativeprocedure = true;
          this.procedure = data.CPT4
          if (data.CPT4.length == 0) {
            this.nodata = true;
          }
          else {
            this.nodata = false;

          }

          console.log("this is the cpt  data from native serach =>", this.procedure);
          console.log("this is the loading =>", loading);
        }
      );
  }
  reset() {
    this.dcode = "";
    this.pcode = "";
    this.nodata = false;

    this.dcodesingleb = false;
    this.dcodesingle = [];
    this.showcard = false;
    this.spinner = false;
    this.dkeyword = "";
    this.progressbar = false;
    this.procedures = [];

    this.finalprocedures = [];
    this.dcodes = [];
    this.proceduresearch = false;
    this.intelligentswitch = false;
    this.nativeprocedure = false;


  }
}

