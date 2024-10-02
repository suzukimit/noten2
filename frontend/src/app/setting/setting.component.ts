import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(public route: ActivatedRoute) { }

  links = [
    { title: 'ユーザー情報', url: 'info' },
    { title: 'その他', url: 'others' }
  ];

  ngOnInit(): void {
  }

}
