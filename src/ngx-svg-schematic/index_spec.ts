import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

let appTree: UnitTestTree;
const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

const createSampleSVGFileInTree = (tree: Tree) => {
  tree.create('src/assets/sample.svg', `
  <svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="none" stroke-width="3" fill="#4169E1" />
  </svg> 
  `)
};

const defaultOptions = {
  svgFileSource: 'src/assets/',
  svgFileDestination: 'src/app/components',
  svgFileName: 'sample.svg'
};


describe('ngx-svg-schematic', () => {
  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      {
        name: 'ngx-svg-schematic-workspace',
        newProjectRoot: 'projects',
        version: '1'
      }
    ).toPromise();
  
    appTree = await runner.runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      {
        name: 'ngx-svg-schematic-app'
      },
      appTree
    ).toPromise();
  });

  it('should be an Angular workspace with an angular.json file', async () => {
    createSampleSVGFileInTree(appTree);

    const tree = await runner.runSchematicAsync('ngx-svg-schematic', defaultOptions, appTree).toPromise();

    expect(tree.exists('/angular.json')).toBeTruthy();
  });
  
  it('Should create svg component', async () => {
    createSampleSVGFileInTree(appTree);
    
    const tree = await runner.runSchematicAsync('ngx-svg-schematic', defaultOptions,  appTree).toPromise();

    expect(tree.exists('/src/app/components/svg-sample.component/svg-sample.component.svg')).toBeTruthy();
    expect(tree.exists('/src/app/components/svg-sample.component/svg-sample.component.ts')).toBeTruthy();
  });
});
