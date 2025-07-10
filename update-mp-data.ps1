# PowerShell script to update MP database with correct images and postcodes

# Real UK postcode to constituency mapping
$POSTCODE_MAPPING = @{
    # London areas
    'E1' = 'Bethnal Green and Stepney'
    'E2' = 'Bethnal Green and Stepney'
    'E3' = 'Bethnal Green and Stepney'
    'E4' = 'Chingford and Woodford Green'
    'E5' = 'Hackney North and Stoke Newington'
    'E6' = 'East Ham'
    'E7' = 'Ilford South'
    'E8' = 'Hackney North and Stoke Newington'
    'E9' = 'Hackney South and Shoreditch'
    'E10' = 'Leyton and Wanstead'
    'E11' = 'Leyton and Wanstead'
    'E12' = 'Ilford South'
    'E13' = 'West Ham'
    'E14' = 'Poplar and Limehouse'
    'E15' = 'West Ham'
    'E16' = 'East Ham'
    'E17' = 'Walthamstow'
    'E18' = 'Chingford and Woodford Green'
    'E20' = 'West Ham'
    
    'N1' = 'Islington North'
    'N2' = 'Finchley and Golders Green'
    'N3' = 'Finchley and Golders Green'
    'N4' = 'Islington North'
    'N5' = 'Islington North'
    'N6' = 'Hornsey and Friern Barnet'
    'N7' = 'Islington North'
    'N8' = 'Hornsey and Friern Barnet'
    'N9' = 'Edmonton and Winchmore Hill'
    'N10' = 'Hornsey and Friern Barnet'
    'N11' = 'Edmonton and Winchmore Hill'
    'N12' = 'Finchley and Golders Green'
    'N13' = 'Edmonton and Winchmore Hill'
    'N14' = 'Southgate and Wood Green'
    'N15' = 'Tottenham'
    'N16' = 'Hackney North and Stoke Newington'
    'N17' = 'Tottenham'
    'N18' = 'Edmonton and Winchmore Hill'
    'N19' = 'Islington North'
    'N20' = 'Finchley and Golders Green'
    'N21' = 'Southgate and Wood Green'
    'N22' = 'Southgate and Wood Green'
    
    'NW1' = 'Holborn and St Pancras'
    'NW2' = 'Brent East'
    'NW3' = 'Hampstead and Highgate'
    'NW4' = 'Hendon'
    'NW5' = 'Holborn and St Pancras'
    'NW6' = 'Hampstead and Highgate'
    'NW7' = 'Hendon'
    'NW8' = 'Regent''s Park and North Marylebone'
    'NW9' = 'Hendon'
    'NW10' = 'Brent East'
    'NW11' = 'Hampstead and Highgate'
    
    'SE1' = 'Bermondsey and Old Southwark'
    'SE2' = 'Erith and Thamesmead'
    'SE3' = 'Lewisham East'
    'SE4' = 'Lewisham East'
    'SE5' = 'Camberwell and Peckham'
    'SE6' = 'Lewisham East'
    'SE7' = 'Erith and Thamesmead'
    'SE8' = 'Lewisham Deptford'
    'SE9' = 'Eltham and Chislehurst'
    'SE10' = 'Greenwich and Woolwich'
    'SE11' = 'Vauxhall and Camberwell Green'
    'SE12' = 'Lewisham East'
    'SE13' = 'Lewisham Deptford'
    'SE14' = 'Lewisham Deptford'
    'SE15' = 'Camberwell and Peckham'
    'SE16' = 'Bermondsey and Old Southwark'
    'SE17' = 'Camberwell and Peckham'
    'SE18' = 'Greenwich and Woolwich'
    'SE19' = 'Croydon North'
    'SE20' = 'Croydon North'
    'SE21' = 'Dulwich and West Norwood'
    'SE22' = 'Dulwich and West Norwood'
    'SE23' = 'Lewisham East'
    'SE24' = 'Dulwich and West Norwood'
    'SE25' = 'Croydon South'
    'SE26' = 'Lewisham East'
    'SE27' = 'Dulwich and West Norwood'
    'SE28' = 'Erith and Thamesmead'
    
    'SW1' = 'Cities of London and Westminster'
    'SW1A' = 'Cities of London and Westminster'
    'SW1E' = 'Cities of London and Westminster'
    'SW1H' = 'Cities of London and Westminster'
    'SW1P' = 'Cities of London and Westminster'
    'SW1V' = 'Cities of London and Westminster'
    'SW1W' = 'Cities of London and Westminster'
    'SW1X' = 'Cities of London and Westminster'
    'SW1Y' = 'Cities of London and Westminster'
    'SW2' = 'Streatham and Croydon North'
    'SW3' = 'Chelsea and Fulham'
    'SW4' = 'Streatham and Croydon North'
    'SW5' = 'Kensington and Bayswater'
    'SW6' = 'Chelsea and Fulham'
    'SW7' = 'Kensington and Bayswater'
    'SW8' = 'Vauxhall and Camberwell Green'
    'SW9' = 'Vauxhall and Camberwell Green'
    'SW10' = 'Chelsea and Fulham'
    'SW11' = 'Battersea'
    'SW12' = 'Battersea'
    'SW13' = 'Richmond Park'
    'SW14' = 'Richmond Park'
    'SW15' = 'Putney'
    'SW16' = 'Streatham and Croydon North'
    'SW17' = 'Tooting'
    'SW18' = 'Battersea'
    'SW19' = 'Wimbledon'
    'SW20' = 'Wimbledon'
    
    'W1' = 'Cities of London and Westminster'
    'W2' = 'Kensington and Bayswater'
    'W3' = 'Ealing Central and Acton'
    'W4' = 'Brentford and Isleworth'
    'W5' = 'Ealing Central and Acton'
    'W6' = 'Hammersmith and Chiswick'
    'W7' = 'Ealing Central and Acton'
    'W8' = 'Kensington and Bayswater'
    'W9' = 'Regent''s Park and North Marylebone'
    'W10' = 'Kensington and Bayswater'
    'W11' = 'Kensington and Bayswater'
    'W12' = 'Hammersmith and Chiswick'
    'W13' = 'Ealing Central and Acton'
    'W14' = 'Hammersmith and Chiswick'
    
    'WC1' = 'Holborn and St Pancras'
    'WC2' = 'Cities of London and Westminster'
    
    'EC1' = 'Islington South and Finsbury'
    'EC2' = 'Cities of London and Westminster'
    'EC3' = 'Cities of London and Westminster'
    'EC4' = 'Cities of London and Westminster'
    
    # Birmingham
    'B1' = 'Birmingham Ladywood'
    'B2' = 'Birmingham Ladywood'
    'B3' = 'Birmingham Ladywood'
    'B4' = 'Birmingham Ladywood'
    'B5' = 'Birmingham Ladywood'
    'B6' = 'Birmingham Erdington'
    'B7' = 'Birmingham Erdington'
    'B8' = 'Birmingham Erdington'
    'B9' = 'Birmingham Erdington'
    'B10' = 'Birmingham Small Heath'
    'B11' = 'Birmingham Small Heath'
    'B12' = 'Birmingham Selly Oak'
    'B13' = 'Birmingham Selly Oak'
    'B14' = 'Birmingham Selly Oak'
    'B15' = 'Birmingham Edgbaston'
    'B16' = 'Birmingham Edgbaston'
    'B17' = 'Birmingham Edgbaston'
    'B18' = 'Birmingham Perry Barr'
    'B19' = 'Birmingham Perry Barr'
    'B20' = 'Birmingham Perry Barr'
    'B21' = 'Birmingham Perry Barr'
    'B23' = 'Birmingham Erdington'
    'B24' = 'Birmingham Erdington'
    'B25' = 'Birmingham Small Heath'
    'B26' = 'Birmingham Yardley'
    'B27' = 'Birmingham Yardley'
    'B28' = 'Birmingham Selly Oak'
    'B29' = 'Birmingham Selly Oak'
    'B30' = 'Birmingham Selly Oak'
    'B31' = 'Birmingham Northfield'
    'B32' = 'Birmingham Northfield'
    'B33' = 'Birmingham Yardley'
    'B34' = 'Birmingham Yardley'
    'B35' = 'Birmingham Erdington'
    'B36' = 'Birmingham Yardley'
    'B37' = 'Birmingham Yardley'
    'B38' = 'Birmingham Northfield'
    'B42' = 'Birmingham Perry Barr'
    'B43' = 'Birmingham Perry Barr'
    'B44' = 'Birmingham Perry Barr'
    'B45' = 'Birmingham Northfield'
    
    # Manchester
    'M1' = 'Manchester Central'
    'M2' = 'Manchester Central'
    'M3' = 'Manchester Central'
    'M4' = 'Manchester Central'
    'M5' = 'Salford'
    'M6' = 'Salford'
    'M7' = 'Salford'
    'M8' = 'Manchester Gorton'
    'M9' = 'Manchester Gorton'
    'M11' = 'Manchester Gorton'
    'M12' = 'Manchester Gorton'
    'M13' = 'Manchester Rusholme'
    'M14' = 'Manchester Rusholme'
    'M15' = 'Manchester Central'
    'M16' = 'Manchester Withington'
    'M17' = 'Stretford and Urmston'
    'M18' = 'Manchester Gorton'
    'M19' = 'Manchester Gorton'
    'M20' = 'Manchester Withington'
    'M21' = 'Manchester Withington'
    'M22' = 'Manchester Withington'
    'M23' = 'Manchester Withington'
    'M25' = 'Bury South'
    'M26' = 'Bury South'
    'M27' = 'Bury South'
    'M28' = 'Worsley and Eccles'
    'M29' = 'Leigh and Atherton'
    'M30' = 'Worsley and Eccles'
    'M31' = 'Stretford and Urmston'
    'M32' = 'Stretford and Urmston'
    'M33' = 'Altrincham and Sale West'
    'M34' = 'Denton and Reddish'
    'M35' = 'Ashton-under-Lyne'
    'M38' = 'Worsley and Eccles'
    'M40' = 'Rochdale'
    'M41' = 'Stretford and Urmston'
    'M43' = 'Denton and Reddish'
    'M44' = 'Manchester Gorton'
    'M45' = 'Bury South'
    'M46' = 'Leigh and Atherton'
    
    # Liverpool
    'L1' = 'Liverpool Riverside'
    'L2' = 'Liverpool Riverside'
    'L3' = 'Liverpool Riverside'
    'L4' = 'Liverpool Walton'
    'L5' = 'Liverpool Walton'
    'L6' = 'Liverpool Walton'
    'L7' = 'Liverpool Riverside'
    'L8' = 'Liverpool Riverside'
    'L9' = 'Liverpool Walton'
    'L10' = 'Liverpool Walton'
    'L11' = 'Liverpool Walton'
    'L12' = 'Liverpool West Derby'
    'L13' = 'Liverpool West Derby'
    'L14' = 'Liverpool West Derby'
    'L15' = 'Liverpool Wavertree'
    'L16' = 'Liverpool Wavertree'
    'L17' = 'Liverpool Wavertree'
    'L18' = 'Liverpool Wavertree'
    'L19' = 'Liverpool Garston'
    'L20' = 'Bootle'
    'L21' = 'Bootle'
    'L22' = 'Bootle'
    'L23' = 'Southport'
    'L24' = 'Liverpool Garston'
    'L25' = 'Liverpool Garston'
    'L26' = 'Liverpool Garston'
    'L27' = 'Liverpool Garston'
    'L28' = 'Liverpool Garston'
    'L30' = 'Bootle'
    'L31' = 'Ormskirk'
    'L32' = 'Liverpool Walton'
    'L33' = 'Liverpool Walton'
    'L34' = 'Liverpool Walton'
    'L35' = 'Liverpool Walton'
    'L36' = 'Liverpool West Derby'
    'L37' = 'Ormskirk'
    'L38' = 'Southport'
    'L39' = 'Ormskirk'
    
    # Bristol
    'BS1' = 'Bristol Central'
    'BS2' = 'Bristol Central'
    'BS3' = 'Bristol South'
    'BS4' = 'Bristol South'
    'BS5' = 'Bristol East'
    'BS6' = 'Bristol North East'
    'BS7' = 'Bristol North East'
    'BS8' = 'Bristol Central'
    'BS9' = 'Bristol North West'
    'BS10' = 'Bristol North West'
    'BS11' = 'Bristol North West'
    'BS13' = 'Bristol South'
    'BS14' = 'Bristol South'
    'BS15' = 'Bristol East'
    'BS16' = 'Bristol East'
    'BS20' = 'Bristol North East'
    'BS22' = 'Weston-super-Mare'
    'BS23' = 'Weston-super-Mare'
    'BS24' = 'Weston-super-Mare'
    'BS34' = 'Bristol North East'
    'BS35' = 'Thornbury and Yate'
    'BS36' = 'Thornbury and Yate'
    'BS37' = 'Thornbury and Yate'
    
    # Leeds
    'LS1' = 'Leeds Central and Headingley'
    'LS2' = 'Leeds Central and Headingley'
    'LS3' = 'Leeds Central and Headingley'
    'LS4' = 'Leeds North West'
    'LS5' = 'Leeds North West'
    'LS6' = 'Leeds North West'
    'LS7' = 'Leeds North East'
    'LS8' = 'Leeds North East'
    'LS9' = 'Leeds East'
    'LS10' = 'Leeds South'
    'LS11' = 'Leeds South'
    'LS12' = 'Leeds West and Pudsey'
    'LS13' = 'Leeds West and Pudsey'
    'LS14' = 'Leeds East'
    'LS15' = 'Leeds East'
    'LS16' = 'Leeds North West'
    'LS17' = 'Leeds North East'
    'LS18' = 'Leeds North East'
    'LS19' = 'Leeds North West'
    'LS20' = 'Leeds North West'
    'LS21' = 'Wetherby and Easingwold'
    'LS22' = 'Wetherby and Easingwold'
    'LS23' = 'Wetherby and Easingwold'
    'LS24' = 'Selby'
    'LS25' = 'Leeds East'
    'LS26' = 'Leeds East'
    'LS27' = 'Leeds West and Pudsey'
    'LS28' = 'Leeds West and Pudsey'
    'LS29' = 'Leeds North West'
    
    # Sheffield
    'S1' = 'Sheffield Central'
    'S2' = 'Sheffield Central'
    'S3' = 'Sheffield Central'
    'S4' = 'Sheffield Central'
    'S5' = 'Sheffield Heeley'
    'S6' = 'Sheffield Hallam'
    'S7' = 'Sheffield Heeley'
    'S8' = 'Sheffield Heeley'
    'S10' = 'Sheffield Hallam'
    'S11' = 'Sheffield Hallam'
    'S12' = 'Sheffield Heeley'
    'S13' = 'Sheffield Heeley'
    'S14' = 'Sheffield Heeley'
    
    # Newcastle
    'NE1' = 'Newcastle upon Tyne Central and West'
    'NE2' = 'Newcastle upon Tyne Central and West'
    'NE4' = 'Newcastle upon Tyne Central and West'
    'NE6' = 'Newcastle upon Tyne East and Wallsend'
    'NE7' = 'Newcastle upon Tyne East and Wallsend'
    'NE12' = 'Newcastle upon Tyne North'
    'NE13' = 'Newcastle upon Tyne North'
    'NE15' = 'Newcastle upon Tyne Central and West'
    
    # Edinburgh
    'EH1' = 'Edinburgh East and Musselburgh'
    'EH2' = 'Edinburgh East and Musselburgh'
    'EH3' = 'Edinburgh West'
    'EH4' = 'Edinburgh North and Leith'
    'EH5' = 'Edinburgh North and Leith'
    'EH6' = 'Edinburgh North and Leith'
    'EH7' = 'Edinburgh North and Leith'
    'EH8' = 'Edinburgh East and Musselburgh'
    'EH9' = 'Edinburgh South'
    'EH10' = 'Edinburgh South'
    'EH11' = 'Edinburgh South West'
    'EH12' = 'Edinburgh West'
    'EH13' = 'Edinburgh West'
    'EH14' = 'Edinburgh West'
    'EH15' = 'Edinburgh East and Musselburgh'
    'EH16' = 'Edinburgh South'
    'EH17' = 'Edinburgh South'
    
    # Glasgow
    'G1' = 'Glasgow East'
    'G2' = 'Glasgow East'
    'G3' = 'Glasgow East'
    'G4' = 'Glasgow East'
    'G5' = 'Glasgow East'
    'G11' = 'Glasgow West'
    'G12' = 'Glasgow West'
    'G13' = 'Glasgow North West'
    'G14' = 'Glasgow North West'
    'G15' = 'Glasgow North West'
    'G20' = 'Glasgow North'
    'G21' = 'Glasgow North'
    'G22' = 'Glasgow North'
    'G23' = 'Glasgow North'
    'G31' = 'Glasgow East'
    'G32' = 'Glasgow East'
    'G33' = 'Glasgow East'
    'G34' = 'Glasgow East'
    'G40' = 'Glasgow East'
    'G41' = 'Glasgow South'
    'G42' = 'Glasgow South'
    'G43' = 'Glasgow South'
    'G44' = 'Glasgow South'
    'G45' = 'Glasgow South'
    'G46' = 'Glasgow South'
    
    # Cardiff
    'CF1' = 'Cardiff East'
    'CF2' = 'Cardiff East'
    'CF3' = 'Cardiff South and Penarth'
    'CF5' = 'Cardiff West'
    'CF10' = 'Cardiff East'
    'CF11' = 'Cardiff South and Penarth'
    'CF14' = 'Cardiff North'
    'CF15' = 'Cardiff North'
    'CF23' = 'Cardiff North'
    'CF24' = 'Cardiff East'
    
    # Belfast
    'BT1' = 'Belfast North'
    'BT2' = 'Belfast North'
    'BT3' = 'Belfast North'
    'BT4' = 'Belfast East'
    'BT5' = 'Belfast East'
    'BT6' = 'Belfast East'
    'BT7' = 'Belfast South and Mid Down'
    'BT8' = 'Belfast South and Mid Down'
    'BT9' = 'Belfast South and Mid Down'
    'BT10' = 'Belfast South and Mid Down'
    'BT11' = 'Belfast West'
    'BT12' = 'Belfast West'
    'BT13' = 'Belfast West'
    'BT14' = 'Belfast North'
    'BT15' = 'Belfast North'
    'BT16' = 'Belfast East'
    'BT17' = 'Belfast West'
}

function Get-PostcodesForConstituency($constituency) {
    $postcodes = @()
    
    foreach ($entry in $POSTCODE_MAPPING.GetEnumerator()) {
        if ($entry.Value -eq $constituency) {
            $postcodes += $entry.Key
        }
    }
    
    if ($postcodes.Count -eq 0) {
        # Generate a fallback postcode
        if ($constituency -like "*London*" -or $constituency -like "*Westminster*" -or $constituency -like "*Kensington*") {
            $postcodes += "SW1"
        } elseif ($constituency -like "*Birmingham*") {
            $postcodes += "B1"
        } elseif ($constituency -like "*Manchester*") {
            $postcodes += "M1"
        } elseif ($constituency -like "*Liverpool*") {
            $postcodes += "L1"
        } elseif ($constituency -like "*Leeds*") {
            $postcodes += "LS1"
        } elseif ($constituency -like "*Bristol*") {
            $postcodes += "BS1"
        } else {
            $postcodes += "SW1A"
        }
    }
    
    return $postcodes
}

function Get-PartyColor($partyName) {
    $partyColors = @{
        'Labour' = 'e4003b'
        'Conservative' = '0087dc'
        'Liberal Democrat' = 'faa61a'
        'Scottish National Party' = 'fff95d'
        'Green Party' = '6ab023'
        'Reform UK' = '12b6cf'
        'Plaid Cymru' = '008142'
        'Democratic Unionist Party' = 'd46a4c'
        'Social Democratic & Labour Party' = '2aa82c'
        'Ulster Unionist Party' = '9999ff'
        'Alliance' = 'f6cb2f'
        'Independent' = '909090'
    }
    
    if ($partyColors.ContainsKey($partyName)) {
        return $partyColors[$partyName]
    } else {
        return '909090'
    }
}

Write-Host "🏛️ Starting MP database update..." -ForegroundColor Green

# Fetch current MPs from Parliament API
try {
    Write-Host "📡 Fetching MPs from Parliament API..." -ForegroundColor Yellow
    
    $uri = "https://members-api.parliament.uk/api/Members/Search?house=Commons`&isCurrentMember=true`&skip=0`&take=650"
    $response = Invoke-RestMethod -Uri $uri -Method Get
    
    Write-Host "Found $($response.totalResults) current MPs" -ForegroundColor Green
    
    $mps = @()
    $totalMPs = $response.totalResults
    
    for ($i = 0; $i -lt $totalMPs; $i += 20) {
        $end = [Math]::Min($i + 20, $totalMPs)
        Write-Host "Processing MPs $($i + 1) to $end..." -ForegroundColor Cyan
        
        $batchUri = "https://members-api.parliament.uk/api/Members/Search?house=Commons`&isCurrentMember=true`&skip=$i`&take=20"
        $batch = Invoke-RestMethod -Uri $batchUri -Method Get
        
        foreach ($member in $batch.items) {
            try {
                # Get detailed member info
                $detailUri = "https://members-api.parliament.uk/api/Members/$($member.value.id)"
                $detail = Invoke-RestMethod -Uri $detailUri -Method Get
                
                # Get constituency
                $constituency = "Unknown"
                if ($detail.latestHouseMembership -and $detail.latestHouseMembership.membershipFrom) {
                    $constituency = $detail.latestHouseMembership.membershipFrom.name
                }
                
                # Get party
                $party = "Independent"
                if ($detail.latestParty) {
                    $party = $detail.latestParty.name
                }
                
                $partyColor = Get-PartyColor $party
                $imageUrl = "https://members-api.parliament.uk/api/Members/$($member.value.id)/Thumbnail"
                $postcodes = Get-PostcodesForConstituency $constituency
                
                # Create MP object
                $mp = @{
                    id = "MP$($member.value.id)"
                    parliamentId = $member.value.id
                    name = if ($member.value.nameDisplayAs) { $member.value.nameDisplayAs } else { $member.value.nameFullTitle }
                    displayName = $member.value.nameDisplayAs
                    fullTitle = $member.value.nameFullTitle
                    constituency = $constituency
                    party = $party
                    partyColor = $partyColor
                    gender = $member.value.gender
                    isActive = $true
                    email = "$($member.value.nameDisplayAs.ToLower().Replace(' ', '.')).mp@parliament.uk"
                    phone = "020 7219 3000"
                    website = ""
                    image = $imageUrl
                    thumbnailUrl = $imageUrl
                    postcodes = $postcodes
                    biography = "$($member.value.nameDisplayAs) is the $party MP for $constituency."
                    addresses = @(
                        @{
                            type = "Parliamentary"
                            fullAddress = "House of Commons, Westminster, London SW1A 0AA"
                            postcode = "SW1A 0AA"
                            line1 = "House of Commons"
                            line2 = "Westminster"
                            town = "London"
                            county = "Greater London"
                            country = "UK"
                        }
                    )
                }
                
                $mps += $mp
                Start-Sleep -Milliseconds 50  # Small delay to avoid rate limiting
                
            } catch {
                Write-Host "❌ Error processing MP $($member.value.id): $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "✅ Successfully processed $($mps.Count) MPs" -ForegroundColor Green
    
    # Count by party
    $partyCount = @{}
    foreach ($mp in $mps) {
        if ($partyCount.ContainsKey($mp.party)) {
            $partyCount[$mp.party]++
        } else {
            $partyCount[$mp.party] = 1
        }
    }
    
    Write-Host "`n📊 Party breakdown:" -ForegroundColor Yellow
    $partyCount.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
        Write-Host "  - $($_.Key): $($_.Value)" -ForegroundColor White
    }
    
    if ($mps.Count -lt 650) {
        Write-Host "`n⚠️ Warning: Only found $($mps.Count) MPs, expected 650. This may be due to:" -ForegroundColor Yellow
        Write-Host "  - Vacant seats awaiting by-elections" -ForegroundColor Gray
        Write-Host "  - API limitations" -ForegroundColor Gray
        Write-Host "  - Recent boundary changes" -ForegroundColor Gray
    }
    
    # Convert to JSON and save
    $mpsJson = $mps | ConvertTo-Json -Depth 10
    $mpsJson | Set-Content -Path "public\data\mps.json" -Encoding UTF8
    Write-Host "✅ MP data updated in public\data\mps.json" -ForegroundColor Green
    
    # Update postcode mapping
    $postcodeJson = $POSTCODE_MAPPING | ConvertTo-Json -Depth 10
    $postcodeJson | Set-Content -Path "public\data\postcode-to-constituency.json" -Encoding UTF8
    Write-Host "✅ Postcode mapping updated in public\data\postcode-to-constituency.json" -ForegroundColor Green
    
    # Create backup
    $timestamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
    $mpsJson | Set-Content -Path "public\data\mps-backup-$timestamp.json" -Encoding UTF8
    Write-Host "✅ Backup created: mps-backup-$timestamp.json" -ForegroundColor Green
    
    Write-Host "`n🎉 Update complete!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "  1. Test the application: npm run dev" -ForegroundColor White
    Write-Host "  2. Verify MP search functionality" -ForegroundColor White
    Write-Host "  3. Check that images load correctly" -ForegroundColor White
    Write-Host "  4. Validate postcode searches" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error updating MP database: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
