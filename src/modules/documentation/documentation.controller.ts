import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DocumentationService } from './documentation.service';

@Controller('ams')
export class DocumentationController {
  constructor(private readonly documentationService: DocumentationService) {}

  @Get()
  getHome(@Res() res: Response) {
    const html = this.documentationService.getDocumentation();
    res.send(html);
  }

  @Get('_sidebar.md')
  getSidebar(@Res() res: Response) {
    const sidebar = this.documentationService.getMarkdownFile('_sidebar');
    res.type('text/markdown').send(sidebar);
  }

  @Get('README.md')
  getReadme(@Res() res: Response) {
    const readme = this.documentationService.getMarkdownFile('README');
    res.type('text/markdown').send(readme);
  }

  @Get(':page.md')
  getMarkdownPage(@Param('page') page: string, @Res() res: Response) {
    const markdown = this.documentationService.getMarkdownFile(page);
    res.type('text/markdown').send(markdown);
  }

  @Get('*')
  getStaticFiles(@Res() res: Response) {
    const html = this.documentationService.getDocumentation();
    res.send(html);
  }
} 