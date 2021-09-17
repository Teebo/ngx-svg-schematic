import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';
//import { workspaces } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngxSvgSchematic(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("/angular.json");

    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not an Angular CLI project')
    } else {

      console.log(_options);

    }



    return tree;
  };
}
