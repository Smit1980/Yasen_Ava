[CmdletBinding(DefaultParameterSetName = 'Group')]
param(
    [Parameter(ParameterSetName = 'Project')]
    [ValidateSet('apex-ui','pipecat','livekit-agents','openai-realtime-agents','fay','vach','opentalking','livetalking','rasa','botpress','parlai','transformers','whisper')]
    [string]$Project,

    [Parameter(ParameterSetName = 'Group')]
    [ValidateSet('pilot','visual','dialog','speech','all')]
    [string]$Group = 'pilot',

    [switch]$List
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$targetRoot = Join-Path $repoRoot 'reference-src'

$projects = [ordered]@{
    'apex-ui' = @{ Url = 'https://github.com/RubenM1990/APEX-UI.git'; Group = @('visual','all') }
    'pipecat' = @{ Url = 'https://github.com/pipecat-ai/pipecat.git'; Group = @('pilot','speech','all') }
    'livekit-agents' = @{ Url = 'https://github.com/livekit/agents.git'; Group = @('speech','all') }
    'openai-realtime-agents' = @{ Url = 'https://github.com/openai/openai-realtime-agents.git'; Group = @('pilot','speech','all') }
    'fay' = @{ Url = 'https://github.com/xszyou/Fay.git'; Group = @('visual','dialog','all') }
    'vach' = @{ Url = 'https://github.com/Hujiazeng/Vach.git'; Group = @('visual','all'); Branch = 'dev' }
    'opentalking' = @{ Url = 'https://github.com/datascale-ai/opentalking.git'; Group = @('visual','speech','all') }
    'livetalking' = @{ Url = 'https://github.com/lipku/LiveTalking.git'; Group = @('visual','speech','all') }
    'rasa' = @{ Url = 'https://github.com/RasaHQ/rasa.git'; Group = @('dialog','all') }
    'botpress' = @{ Url = 'https://github.com/botpress/botpress.git'; Group = @('dialog','all') }
    'parlai' = @{ Url = 'https://github.com/facebookresearch/ParlAI.git'; Group = @('dialog','all') }
    'transformers' = @{ Url = 'https://github.com/huggingface/transformers.git'; Group = @('dialog','speech','all') }
    'whisper' = @{ Url = 'https://github.com/openai/whisper.git'; Group = @('pilot','speech','all') }
}

if ($List) {
    $projects.GetEnumerator() | ForEach-Object {
        [pscustomobject]@{ Project = $_.Key; Groups = ($_.Value.Group -join ','); Url = $_.Value.Url }
    } | Format-Table -AutoSize
    exit 0
}

if ($Project) {
    $selected = @($Project)
} else {
    $selected = @($projects.GetEnumerator() | Where-Object { $_.Value.Group -contains $Group } | ForEach-Object Key)
}

New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null

foreach ($name in $selected) {
    $entry = $projects[$name]
    $destination = Join-Path $targetRoot $name
    if (Test-Path -LiteralPath $destination) {
        Write-Host "SKIP  $name — папка уже существует"
        continue
    }

    $arguments = @('clone', '--depth', '1', '--filter=blob:none')
    if ($entry.Branch) { $arguments += @('--branch', $entry.Branch) }
    $arguments += @($entry.Url, $destination)
    Write-Host "CLONE $name"
    & git @arguments
    if ($LASTEXITCODE -ne 0) { throw "Не удалось клонировать $name" }
}

Write-Host "Готово: $targetRoot"
