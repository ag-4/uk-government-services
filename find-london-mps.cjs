const fs = require('fs');

// Load the MP data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));

// Find London MPs
const londonMPs = mps.filter(mp => 
  mp.constituency && (
    mp.constituency.includes('London') || 
    mp.constituency.includes('Westminster') ||
    mp.constituency.includes('Kensington') ||
    mp.constituency.includes('Chelsea') ||
    mp.constituency.includes('Islington') ||
    mp.constituency.includes('Camden') ||
    mp.constituency.includes('Hackney') ||
    mp.constituency.includes('Tower Hamlets') ||
    mp.constituency.includes('Southwark') ||
    mp.constituency.includes('Lambeth') ||
    mp.constituency.includes('Wandsworth') ||
    mp.constituency.includes('Hammersmith') ||
    mp.constituency.includes('Fulham') ||
    mp.constituency.includes('Bermondsey') ||
    mp.constituency.includes('Bethnal Green') ||
    mp.constituency.includes('Bow') ||
    mp.constituency.includes('Poplar') ||
    mp.constituency.includes('Stepney') ||
    mp.constituency.includes('Whitechapel') ||
    mp.constituency.includes('Walthamstow') ||
    mp.constituency.includes('Leyton') ||
    mp.constituency.includes('East Ham') ||
    mp.constituency.includes('West Ham') ||
    mp.constituency.includes('Barking') ||
    mp.constituency.includes('Dagenham') ||
    mp.constituency.includes('Chingford') ||
    mp.constituency.includes('Hornsey') ||
    mp.constituency.includes('Finchley') ||
    mp.constituency.includes('Hendon') ||
    mp.constituency.includes('Brent') ||
    mp.constituency.includes('Harrow') ||
    mp.constituency.includes('Ealing') ||
    mp.constituency.includes('Acton') ||
    mp.constituency.includes('Hounslow') ||
    mp.constituency.includes('Feltham') ||
    mp.constituency.includes('Richmond') ||
    mp.constituency.includes('Twickenham') ||
    mp.constituency.includes('Kingston') ||
    mp.constituency.includes('Sutton') ||
    mp.constituency.includes('Croydon') ||
    mp.constituency.includes('Bromley') ||
    mp.constituency.includes('Greenwich') ||
    mp.constituency.includes('Lewisham') ||
    mp.constituency.includes('Deptford') ||
    mp.constituency.includes('Dulwich') ||
    mp.constituency.includes('Streatham') ||
    mp.constituency.includes('Mitcham') ||
    mp.constituency.includes('Morden') ||
    mp.constituency.includes('Wimbledon') ||
    mp.constituency.includes('Tooting') ||
    mp.constituency.includes('Battersea') ||
    mp.constituency.includes('Putney') ||
    mp.constituency.includes('Cities of London')
  )
);

console.log(`Found ${londonMPs.length} London MPs:`);
console.log("=".repeat(50));

londonMPs.sort((a, b) => a.constituency.localeCompare(b.constituency));

londonMPs.forEach(mp => {
  console.log(`${mp.constituency} - ${mp.name} (${mp.party})`);
});

// Let's also look for constituencies with common area patterns that might be missing
console.log("\n\nAll unique constituencies (first 100):");
console.log("=".repeat(50));

const allConstituencies = [...new Set(mps.map(mp => mp.constituency))];
allConstituencies.sort().slice(0, 100).forEach(constituency => {
  console.log(constituency);
});
