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
            $line_t = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " type: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " price: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
            $line_t | Add-Content $item_path -Encoding utf8
        }
        elseif($line | Select-String -Pattern "^];") {
            $item_flg = $false
        }
    }

    # enemy
    if($line.Contains("const ENEMY_DATA")) {
        Add-Content $enemy_path "id,name,char,hp,fp,atk,def,speed,sight_range,escape_flag,distance,group_spawn_flag,berserk_flag,exp," -Encoding utf8
        $enemy_flg = $true
    }
    if($enemy_flg){
        if($line | Select-String -Pattern " id: ") {
            $line_t = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " char: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " hp: ") {
            $line_tt = $line.Substring($line.IndexOf(': ')+2)
            $line_t = $line_t + ($line_tt[0..$line_tt.IndexOf(',')] -join '')
        }
        elseif($line | Select-String -Pattern " fp: ") {
            $line_tt = $line.Substring($line.IndexOf(': ')+2)
            $line_t = $line_t + ($line_tt[0..$line_tt.IndexOf(',')] -join '')
        }
        elseif($line | Select-String -Pattern " atk: ") {
            $line_tt = $line.Substring($line.IndexOf(': ')+2)
            $line_t = $line_t + ($line_tt[0..$line_tt.IndexOf(',')] -join '')
            $line_t = $line_t + $line_tt.Substring($line_tt.IndexOf(': ')+2)
        }
        elseif($line | Select-String -Pattern " speed: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
        }
        elseif($line | Select-String -Pattern " sight_range: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
        }
        elseif($line | Select-String -Pattern " escape_flag: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
        }
        elseif($line | Select-String -Pattern " distance: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
        }
        elseif($line | Select-String -Pattern " group_spawn_flag: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
        }
        elseif($line | Select-String -Pattern " berserk_flag: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
        }
        elseif($line | Select-String -Pattern " exp: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
            $line_t | Add-Content $enemy_path -Encoding utf8
        }
        elseif($line | Select-String -Pattern "^];") {
            $enemy_flg = $false
        }
    }
    
    # skill
    if($line.Contains("const SKILL_DATA")) {
        Add-Content $skill_path "id,name,target_type,cost_type,cost" -Encoding utf8
        $skill_flg = $true
    }
    if($skill_flg){
        if($line | Select-String -Pattern " id: ") {
            $line_t = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " target_type: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " cost_type: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " cost: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf(': ')+2)
            $line_t | Add-Content $skill_path -Encoding utf8
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
            $line_t = $line.Substring($line.IndexOf("0"))
        }
        elseif($line | Select-String -Pattern " name: ") {
            $line_t = $line_t + $line.Substring($line.IndexOf('"')).Replace('"', '')
        }
        elseif($line | Select-String -Pattern " turn: ") {
            $line_t = $line_t + $line.Substring(14)
            $line_t | Add-Content $condition_path -Encoding utf8
        }
        elseif($line | Select-String -Pattern "^];") {
            $condition_flg = $false
        }
    }
}
