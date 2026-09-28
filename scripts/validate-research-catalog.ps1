$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$catalogPath = Join-Path $repoRoot 'research\project-catalog.json'
$catalog = Get-Content -LiteralPath $catalogPath -Raw -Encoding utf8 | ConvertFrom-Json

if ($catalog.schema_version -ne 1) { throw 'Неизвестная версия схемы каталога' }
if ($catalog.projects.Count -ne 14) { throw "Ожидалось 14 проектов, найдено $($catalog.projects.Count)" }

$duplicateIds = $catalog.projects | Group-Object id | Where-Object Count -gt 1
if ($duplicateIds) { throw "Повторяющиеся id: $($duplicateIds.Name -join ', ')" }

foreach ($project in $catalog.projects) {
    if (-not $project.id -or -not $project.name -or -not $project.card) {
        throw 'В карточке проекта отсутствует id, name или card'
    }
    $cardPath = Join-Path $repoRoot ($project.card -replace '/', '\')
    if (-not (Test-Path -LiteralPath $cardPath)) { throw "Нет карточки: $cardPath" }
    if ($project.source_url -and $project.source_url -notmatch '^https://github\.com/') {
        throw "Некорректный source_url у $($project.id)"
    }
}

Write-Host "OK: 14 проектов, уникальные id, все карточки существуют."
