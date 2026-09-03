@echo off

set data_path=".\src\data.js"
set reading_item_flg="false"

for /f %%l in %data_path% do (
    if %%l eq "const ITEM_DATA = [" (
        set reading_item_flg="true"
    )
    else if %%l eq
    if %reading_item_flg% eq "true" (

    )
)