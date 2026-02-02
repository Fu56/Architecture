# Find all remaining window.confirm usage in the codebase
Write-Host "`n=== Files Still Using window.confirm ===" -ForegroundColor Yellow
Write-Host "These files need to be updated to use the confirmation modal`n" -ForegroundColor Cyan

$results = Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "window\.confirm" | Where-Object { $_.Line -notmatch "to replace window\.confirm" }

if ($results) {
    $groupedResults = $results | Group-Object Path
    
    foreach ($group in $groupedResults) {
        $relativePath = $group.Name -replace [regex]::Escape((Get-Location).Path + "\"), ""
        Write-Host "`n📄 $relativePath" -ForegroundColor Green
        
        foreach ($match in $group.Group) {
            Write-Host "   Line $($match.LineNumber): " -NoNewline -ForegroundColor Gray
            Write-Host $match.Line.Trim() -ForegroundColor White
        }
    }
    
    Write-Host "`n`n📊 Summary:" -ForegroundColor Yellow
    Write-Host "   Total files: $($groupedResults.Count)" -ForegroundColor Cyan
    Write-Host "   Total occurrences: $($results.Count)" -ForegroundColor Cyan
    
    Write-Host "`n💡 To fix these:" -ForegroundColor Yellow
    Write-Host "   1. Import: import { useConfirm } from '../../hooks/useConfirm';" -ForegroundColor White
    Write-Host "   2. Use hook: const { confirm, ConfirmDialog } = useConfirm();" -ForegroundColor White
    Write-Host "   3. Replace window.confirm with await confirm({ ... });" -ForegroundColor White
    Write-Host "   4. Render: <ConfirmDialog /> in your component JSX" -ForegroundColor White
    Write-Host "`n   See TOAST_AND_MODAL_GUIDE.md for detailed examples`n" -ForegroundColor Cyan
} else {
    Write-Host "`n✅ No window.confirm usage found! All files are updated.`n" -ForegroundColor Green
}
