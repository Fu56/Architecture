# Script to update all toast imports from react-toastify to lib/toast
# This ensures consistent toast usage across the application

$files = @(
    "src/pages/Home.tsx",
    "src/pages/user/Profile.tsx",
    "src/pages/user/Notifications.tsx",
    "src/pages/library/PostBlog.tsx",
    "src/pages/library/Upload.tsx",
    "src/pages/library/ResourceDetails.tsx",
    "src/pages/superadmin/Settings.tsx",
    "src/pages/superadmin/ManageDeptHeads.tsx",
    "src/pages/auth/Login.tsx",
    "src/pages/admin/RegisterStudents.tsx",
    "src/pages/admin/RegisterFaculty.tsx",
    "src/pages/admin/NewsManager.tsx",
    "src/pages/admin/ManageUsers.tsx",
    "src/pages/admin/Flags.tsx",
    "src/pages/admin/Approvals.tsx"
)

foreach ($file in $files) {
    $fullPath = "E:\Fuad\Architecture\app\client\$file"
    if (Test-Path $fullPath) {
        Write-Host "Updating $file..." -ForegroundColor Green
        
        # Read content
        $content = Get-Content $fullPath -Raw
        
        # Replace react-toastify import with lib/toast
        # Count ../ based on directory depth
        $depth = ($file -split '/').Count - 2
        $relativePath = "../" * $depth + "lib/toast"
        
        $content = $content -replace 'import \{ toast \} from "react-toastify";', "import { toast } from `"$relativePath`";"
        
        # Write back
        Set-Content $fullPath $content -NoNewline
        
        Write-Host "  ✓ Updated toast import" -ForegroundColor Cyan
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n✓ All toast imports updated!" -ForegroundColor Green
Write-Host "Toast notifications will now appear at bottom-right with Warm Earth styling." -ForegroundColor Cyan
