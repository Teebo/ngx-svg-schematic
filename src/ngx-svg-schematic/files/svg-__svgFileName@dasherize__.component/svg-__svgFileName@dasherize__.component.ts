import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'svg-<%= dasherize(svgFileName) %>-component',
  templateUrl: './svg-<%= dasherize(svgFileName) %>.component.svg',
  styles: [`<%= styles.join(' ') %>`],
})
export class Svg<%= classify(svgFileName) %>Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}