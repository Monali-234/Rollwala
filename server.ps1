param (
    [int]$Port = 3000
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
    $listener.Start()
} catch {
    Write-Host "Port $Port busy or failed: $_"
    # Try 8080 if 3000 fails
    $Port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
}

Write-Host "SERVER_RUNNING: http://localhost:$Port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

$baseDir = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.AbsolutePath
        if ($rawUrl -eq "/" -or [string]::IsNullOrWhiteSpace($rawUrl)) {
            $rawUrl = "/index.html"
        }

        $decodedPath = [System.Uri]::UnescapeDataString($rawUrl).TrimStart('/')
        $decodedPath = $decodedPath -replace '/', '\'
        $filePath = Join-Path $baseDir $decodedPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $contentBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $contentBytes.Length
            $response.OutputStream.Write($contentBytes, 0, $contentBytes.Length)
        } else {
            # Fallback to index.html for SPA
            $indexHtml = Join-Path $baseDir "index.html"
            if (Test-Path $indexHtml) {
                $response.ContentType = "text/html; charset=utf-8"
                $contentBytes = [System.IO.File]::ReadAllBytes($indexHtml)
                $response.ContentLength64 = $contentBytes.Length
                $response.OutputStream.Write($contentBytes, 0, $contentBytes.Length)
            } else {
                $response.StatusCode = 404
            }
        }
        $response.OutputStream.Close()
    } catch {
        # continue handling requests
    }
}
