import { strings,  } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree, SchematicsException, url, apply, template, mergeWith, move } from '@angular-devkit/schematics';
import { normalize } from 'path';
import { Schema } from './schema';

const jsdom = require("jsdom");

const fileSearchRootDIR = 'src/';
const defaultSourcePath = `${fileSearchRootDIR}assets/`;
const svgFileExtension = '.svg';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngxSvgSchematic(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("/angular.json");

    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not an Angular CLI project')
    } else {
      const { svgFileSource, svgFileName, svgFileDestination } = _options;

      // We could read the `svgFileSource` for a list of file names the user can selected from
      // https://github.com/angular/angular-cli/issues/16705

      // 1 .check if user provided path starts with '/' if so, remove it
      // 2. check if the resulting string starts with 'src', if not, prepend it 

      let userProvidedSourcePath = (
        svgFileSource.charAt(0) === '/' 
          ? 
          svgFileSource.replace('/', '') : svgFileSource
        ).startsWith('src') 
        ? 
        svgFileSource : `${fileSearchRootDIR}${svgFileSource}`;

      // check if user provided path ennds with '/', if not, append it

      userProvidedSourcePath = userProvidedSourcePath.endsWith('/') 
        ? 
        userProvidedSourcePath : `${userProvidedSourcePath}/`

      const sourceDIR = svgFileSource === defaultSourcePath ? svgFileSource : userProvidedSourcePath;
      const completeSVGFilePath = `${sourceDIR}${svgFileName.endsWith(svgFileExtension) ? svgFileName : `${svgFileName}${svgFileExtension}`}`;
      const svgMarkup = tree.read(completeSVGFilePath)?.toString() || '';

      if(tree.read(completeSVGFilePath)?.toString() === null) {
        throw new SchematicsException(`Could not find a SVG file with path: ${completeSVGFilePath}`);
      }

      if(tree.read(completeSVGFilePath)?.toString() === '') {
        console.warn('It seems like there is no SVG markup in the file');
      }

      if(tree.read(completeSVGFilePath)?.toString() === undefined) {
        throw new SchematicsException(`Could not find a SVG file with path: ${completeSVGFilePath}`);
      }

      const dom = new jsdom.JSDOM(`<!DOCTYPE html>`);
      const doc = new dom.window.DOMParser().parseFromString(svgMarkup, 'text/xml');
      const styles: string[] = [];

      [...doc.getElementsByTagName('style')].forEach((element: any) => {
        styles.push(`${element.innerHTML}`);
        element.remove();
      });

      const sourceTemplate = url('./files');

      const parameterizedSOurceTemplate = apply(sourceTemplate, [
        template({
          ..._options,
          ...strings,
          svgMarkup: doc.documentElement.outerHTML,
          svgFileName: svgFileName.replace(svgFileExtension, ''),
          styles,
        }),
        move(normalize(svgFileDestination))
      ]);


      return mergeWith(parameterizedSOurceTemplate);
    }
  };
}
