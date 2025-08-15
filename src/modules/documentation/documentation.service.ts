import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DocumentationService {
  private readonly docsPath = join(process.cwd(), 'docs');

  getDocumentation(): string {
    try {
      const indexPath = join(this.docsPath, 'index.html');
      return readFileSync(indexPath, 'utf8');
    } catch (error) {
      return this.getErrorPage();
    }
  }

  getMarkdownFile(filename: string): string {
    try {
      // Handle README.md specially
      if (filename === 'README' || filename === '') {
        const filePath = join(this.docsPath, 'modules', 'README.md');
        return readFileSync(filePath, 'utf8');
      }

      // Handle sidebar
      if (filename === '_sidebar') {
        const filePath = join(this.docsPath, '_sidebar.md');
        return readFileSync(filePath, 'utf8');
      }

      // Handle other markdown files
      const filePath = join(this.docsPath, 'modules', `${filename}.md`);
      return readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading markdown file ${filename}:`, error);
      return '# Page Not Found\n\nThe requested documentation page could not be found.';
    }
  }

  private getErrorPage(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - AMS Documentation</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container mt-5">
          <div class="alert alert-danger">
            <h4 class="alert-heading">Documentation Not Found</h4>
            <p>The documentation could not be loaded.</p>
            <hr>
            <p class="mb-0">
              <a href="/ams" class="btn btn-primary">Return to Home</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
} 