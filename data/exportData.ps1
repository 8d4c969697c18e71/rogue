$file = Get-Content "./src/data.js" -Encoding utf8

$item_path = "./data/item.csv"
$enemy_path = "./data/enemy.csv"
$skill_path = "./data/skill.csv"
$condition_path = "./data/condition.csv"
Remove-Item $item_path
Remove-Item $enemy_path
Remove-Item $skill_path
Remove-Item $condition_path

$item_flg = $false
$enemy_flg = $false
$skill_flg = $false
$condition_flg = $false

foreach ($line in $file) {
    # item
    if($line.Contains("const ITEM_DATA")) {
        Add-Content $item_path "id,name,type,price," -Encoding utf8
        $item_flg = $true
    }
    if($item_flg){
        if($line | Select-String -Pattern " id: ") {
            $line_tmp = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_tmp = $line_tmp + $line.Substring($line.IndexOf('"'))
        }
        elseif($line | Select-String -Pattern " type: ") {
            $line_tmp = $line_tmp + $line.Substring($line.IndexOf('"'))
        }
        elseif($line | Select-String -Pattern " price: ") {
            $line_tmp = $line_tmp + $line.Substring($line.IndexOf(': ')+2)
            $line_tmp | Add-Content $item_path -Encoding utf8
        }
        elseif($line | Select-String -Pattern "^];") {
            $item_flg = $false
        }
    }

    # enemy
    if($line.Contains("const ENEMY_DATA")) {
        Add-Content $enemy_path "id,name,char," -Encoding utf8
        $enemy_flg = $true
    }
    if($enemy_flg){
        if($line | Select-String -Pattern " id: ") {
            $line_tmp = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_tmp = $line_tmp + $line.Substring($line.IndexOf('"'))
        }
        elseif($line | Select-String -Pattern " char: ") {
            $line_tmp = $line_tmp + $line.Substring($line.IndexOf('"'))
            $line_tmp | Add-Content $enemy_path -Encoding utf8
        }
        elseif($line | Select-String -Pattern "^];") {
            $enemy_flg = $false
        }
    }
    
    # skill
    if($line.Contains("const SKILL_DATA")) {
        Add-Content $skill_path "id,name," -Encoding utf8
        $skill_flg = $true
    }
    if($skill_flg){
        if($line | Select-String -Pattern " id: ") {
            $line_tmp = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_tmp = $line_tmp + $line.Substring($line.IndexOf('"'))
            $line_tmp | Add-Content $skill_path -Encoding utf8
        }
        elseif($line | Select-String -Pattern "^];") {
            $skill_flg = $false
        }
    }
    
    # condition
    if($line.Contains("const CONDITION_DATA")) {
        Add-Content $condition_path "id,name,turn," -Encoding utf8
        $condition_flg = $true
    }
    if($condition_flg){
        if($line | Select-String -Pattern " id: ") {
            $line_tmp = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_tmp = $line_tmp + $line.Substring($line.IndexOf('"'))
        }
        elseif($line | Select-String -Pattern " turn: ") {
            $line_tmp = $line_tmp + $line.Substring(14)
            $line_tmp | Add-Content $condition_path -Encoding utf8
        }
        elseif($line | Select-String -Pattern "^];") {
            $condition_flg = $false
        }
    }
}
