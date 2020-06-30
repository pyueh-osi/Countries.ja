# Build all our sources

Write-Host
Write-Host "Building metadata..."
Write-Host

docfx metadata docfx.json

Write-Host
Write-Host "Building articles..."
Write-Host
docfx build docfx.json

Write-Host
Write-Host "Building PDF..."
Write-Host
docfx pdf docfx.json


# Copy our pdf to the _site and rename

copy .\_site_pdf\docfx_project_pdf.pdf .\_site\Countries.ja.pdf


