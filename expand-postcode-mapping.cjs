const fs = require('fs');

// Load existing mapping
const existingMapping = JSON.parse(fs.readFileSync('./public/data/postcode-to-constituency.json', 'utf8'));

// London constituency to postcode area mappings based on real geographic data
const londonPostcodeMappings = {
  // Central London
  "Cities of London and Westminster": ["EC1", "EC2", "EC3", "EC4", "WC1", "WC2", "SW1"],
  "Westminster North": ["W2", "W9", "NW1"],
  
  // East London
  "Bethnal Green and Stepney": ["E1", "E2"],
  "Poplar and Limehouse": ["E3", "E14"],
  "Hackney South and Shoreditch": ["E8", "N1"],
  "Hackney North and Stoke Newington": ["N16", "E5"],
  "Leyton and Wanstead": ["E10", "E11"],
  "West Ham and Beckton": ["E6", "E13", "E16"],
  "East Ham": ["E12", "E6"],
  "Barking": ["IG11", "E6"],
  "Dagenham and Rainham": ["RM8", "RM9", "RM10"],
  "Walthamstow": ["E17"],
  
  // North London
  "Islington North": ["N1", "N7"],
  "Islington South and Finsbury": ["N1", "EC1"],
  "Hornsey and Friern Barnet": ["N8", "N10", "N11", "N12"],
  "Finchley and Golders Green": ["N3", "N11", "N12", "NW11"],
  "Hendon": ["NW4", "NW9"],
  "Harrow East": ["HA1", "HA2"],
  "Harrow West": ["HA1", "HA2", "HA3"],
  "Brent East": ["NW10", "HA0"],
  "Brent West": ["NW10", "NW2"],
  
  // West London
  "Kensington and Bayswater": ["W8", "W2", "W11"],
  "Chelsea and Fulham": ["SW3", "SW6", "SW10"],
  "Hammersmith and Chiswick": ["W4", "W6", "W12"],
  "Ealing Central and Acton": ["W3", "W5", "NW10"],
  "Ealing North": ["UB1", "UB2", "W13"],
  "Ealing Southall": ["UB1", "UB2"],
  "Feltham and Heston": ["TW13", "TW14", "UB3"],
  "Brentford and Isleworth": ["TW7", "TW8"],
  
  // South West London
  "Putney": ["SW15"],
  "Wandsworth": ["SW18", "SW11"],
  "Battersea": ["SW8", "SW11"],
  "Tooting": ["SW17"],
  "Mitcham and Morden": ["SM4", "SW19", "CR4"],
  "Wimbledon": ["SW19", "SW20"],
  "Kingston and Surbiton": ["KT1", "KT2", "KT5", "KT6"],
  "Richmond Park": ["TW9", "TW10", "SW14"],
  "Twickenham": ["TW1", "TW2", "TW11", "TW12"],
  "Sutton and Cheam": ["SM1", "SM2", "SM3"],
  
  // South East London
  "Bermondsey and Old Southwark": ["SE1", "SE16"],
  "Camberwell and Peckham": ["SE5", "SE15", "SE22"],
  "Dulwich and West Norwood": ["SE19", "SE21", "SE24", "SE27"],
  "Streatham and Croydon North": ["SW2", "SW16", "CR0"],
  "Lewisham West and East Dulwich": ["SE21", "SE22", "SE23"],
  "Lewisham East": ["SE12", "SE13"],
  "Lewisham North": ["SE13", "SE14"],
  "Lewisham South": ["SE6", "SE12"],
  "Greenwich and Woolwich": ["SE7", "SE9", "SE10", "SE18"],
  "Eltham and Chislehurst": ["SE9", "BR7"],
  "Bromley and Biggin Hill": ["BR1", "BR2", "BR6"],
  "Croydon East": ["CR0", "SE25"],
  "Croydon South": ["CR2", "CR8"],
  "Croydon North": ["CR0", "CR7"],
};

// Combine with existing mapping
const newMapping = { ...existingMapping };

// Add London postcodes
Object.entries(londonPostcodeMappings).forEach(([constituency, postcodes]) => {
  postcodes.forEach(postcode => {
    newMapping[postcode] = constituency;
  });
});

// Also add some common patterns that might be missing
const additionalMappings = {
  // More Bristol areas
  "BS35": "Thornbury and Yate",
  "BS36": "Thornbury and Yate",
  "BS37": "Thornbury and Yate",
  
  // More Manchester areas
  "M24": "Heywood and Middleton",
  "M25": "Bury South",
  "M26": "Bury North",
  "M27": "Prestwich",
  "M28": "Worsley and Eccles South",
  "M29": "Leigh and Atherton",
  "M30": "Eccles",
  "M31": "Carrington",
  "M32": "Stretford and Urmston",
  "M33": "Sale and Altrincham",
  "M34": "Denton and Reddish",
  "M35": "Failsworth and Oldham East",
  "M38": "Worsley and Eccles South",
  "M40": "Withington",
  "M41": "Urmston",
  "M43": "Droylsden",
  "M44": "Irlam",
  "M45": "Whitefield",
  "M46": "Atherton",
  
  // Birmingham areas
  "B6": "Birmingham Erdington",
  "B7": "Birmingham Erdington", 
  "B8": "Birmingham Hodge Hill and Solihull North",
  "B9": "Birmingham Ladywood",
  "B10": "Birmingham Hall Green and Moseley",
  "B11": "Birmingham Hall Green and Moseley",
  "B12": "Birmingham Selly Oak",
  "B13": "Birmingham Hall Green and Moseley",
  "B14": "Birmingham Selly Oak",
  "B23": "Birmingham Erdington",
  "B24": "Birmingham Erdington",
  "B25": "Birmingham Yardley",
  "B26": "Birmingham Yardley",
  "B27": "Birmingham Yardley",
  "B28": "Birmingham Northfield",
  "B29": "Birmingham Selly Oak",
  "B30": "Birmingham Northfield",
  "B31": "Birmingham Northfield",
  "B32": "Birmingham Edgbaston",
  "B33": "Birmingham Yardley",
  "B34": "Birmingham Hodge Hill and Solihull North",
  "B35": "Birmingham Hodge Hill and Solihull North",
  "B36": "Birmingham Hodge Hill and Solihull North",
  "B37": "Birmingham Hodge Hill and Solihull North",
  "B38": "Birmingham Northfield",
  "B42": "Birmingham Perry Barr",
  "B43": "Birmingham Perry Barr",
  "B44": "Birmingham Perry Barr",
  "B45": "Birmingham Northfield",
  
  // Leeds areas
  "LS21": "Pudsey",
  "LS22": "Wetherby and Easingwold",
  "LS23": "Wetherby and Easingwold",
  "LS24": "Selby",
  "LS25": "Morley and Outwood",
  "LS26": "Morley and Outwood",
  "LS27": "Morley and Outwood",
  "LS28": "Pudsey",
  "LS29": "Keighley and Ilkley",
  
  // Liverpool areas
  "L19": "Garston and Halewood",
  "L20": "Bootle",
  "L21": "Bootle",
  "L22": "Bootle",
  "L23": "Southport",
  "L24": "Garston and Halewood",
  "L25": "Garston and Halewood",
  "L26": "Garston and Halewood",
  "L27": "Liverpool Riverside",
  "L28": "Liverpool West Derby",
  "L29": "Southport",
  "L30": "Bootle",
  "L31": "Ormskirk",
  "L32": "Knowsley",
  "L33": "Knowsley",
  "L34": "Knowsley",
  "L35": "St Helens South and Whiston",
  "L36": "St Helens South and Whiston",
  "L37": "Ormskirk",
  "L38": "Southport",
  "L39": "Ormskirk",
  
  // Sheffield areas
  "S9": "Sheffield South East",
  "S15": "Sheffield Heeley",
  "S16": "Sheffield Heeley",
  "S17": "Sheffield Hallam", 
  "S18": "Rother Valley",
  "S19": "Sheffield Heeley",
  "S20": "Sheffield Hallam",
  "S21": "Rother Valley",
  "S25": "Rother Valley",
  "S26": "Rother Valley",
  "S35": "Sheffield Brightside and Hillsborough",
  "S36": "Penistone and Stocksbridge",
  "S60": "Rotherham",
  "S61": "Rotherham",
  "S62": "Rotherham",
  "S63": "Rotherham",
  "S64": "Rotherham",
  "S65": "Rotherham",
  "S66": "Rotherham",
  "S70": "Barnsley North",
  "S71": "Barnsley South",
  "S72": "Barnsley North",
  "S73": "Barnsley South",
  "S74": "Barnsley North",
  "S75": "Barnsley South",
};

// Add additional mappings
Object.entries(additionalMappings).forEach(([postcode, constituency]) => {
  newMapping[postcode] = constituency;
});

// Write the expanded mapping
fs.writeFileSync('./public/data/postcode-to-constituency.json', JSON.stringify(newMapping, null, 2));

console.log(`Expanded postcode mapping from ${Object.keys(existingMapping).length} to ${Object.keys(newMapping).length} postcode areas`);

// Show some stats
const londnAreas = Object.keys(newMapping).filter(area => 
  area.startsWith('E') || area.startsWith('EC') || area.startsWith('N') || 
  area.startsWith('NW') || area.startsWith('SE') || area.startsWith('SW') || 
  area.startsWith('W') || area.startsWith('WC') || area.startsWith('TW') ||
  area.startsWith('HA') || area.startsWith('UB') || area.startsWith('KT') ||
  area.startsWith('SM') || area.startsWith('CR') || area.startsWith('BR') ||
  area.startsWith('IG') || area.startsWith('RM')
);

console.log(`London postcode areas: ${londnAreas.length}`);
console.log(`Sample London areas: ${londnAreas.slice(0, 20).join(', ')}`);

// Test the new mapping
console.log(`\nTesting new mapping:`);
const testCases = ['E1', 'E14', 'N1', 'NW1', 'SE1', 'SW1', 'W1', 'HA1', 'CR0'];
testCases.forEach(test => {
  const result = newMapping[test];
  console.log(`${test}: ${result || 'Not found'}`);
});
