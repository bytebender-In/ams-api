const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'modules')));

// Convert markdown to HTML
function markdownToHtml(markdown) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Module Documentation</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        pre { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
        code { background-color: #f8f9fa; padding: 2px 5px; border-radius: 3px; }
        .nav { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <nav class="nav">
          <a class="nav-link" href="/">Home</a>
          <a class="nav-link" href="/architecture">Architecture</a>
          <a class="nav-link" href="/structure">Structure</a>
          <a class="nav-link" href="/features">Features</a>
          <a class="nav-link" href="/api-examples">API Examples</a>
          <a class="nav-link" href="/sample-data">Sample Data</a>
        </nav>
        ${marked.parse(markdown)}
      </div>
    </body>
    </html>
  `;
}

// Routes
app.get('/', (req, res) => {
  const readmePath = path.join(__dirname, 'modules', 'README.md');
  const markdown = fs.readFileSync(readmePath, 'utf8');
  res.send(markdownToHtml(markdown));
});

app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'modules', `${page}.md`);
  
  if (fs.existsSync(filePath)) {
    const markdown = fs.readFileSync(filePath, 'utf8');
    res.send(markdownToHtml(markdown));
  } else {
    res.status(404).send('Page not found');
  }
});

app.listen(port, () => {
  console.log(`Documentation server running at http://localhost:${port}`);
}); 