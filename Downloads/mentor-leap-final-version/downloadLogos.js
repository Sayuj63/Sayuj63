const fs = require('fs');
const https = require('https');
const path = require('path');

const domains = [
  { name: "BBC London", id: "bbc", domain: "bbc.com" },
  { name: "CNBC-TV18", id: "cnbctv18", domain: "cnbctv18.com" },
  { name: "Forbes India", id: "forbesindia", domain: "forbesindia.com" },
  { name: "Moneycontrol", id: "moneycontrol", domain: "moneycontrol.com" },
  { name: "Times Network", id: "timesnetwork", domain: "timesnetwork.in" },
  { name: "Deloitte", id: "deloitte", domain: "deloitte.com" },
  { name: "Wipro", id: "wipro", domain: "wipro.com" },
  { name: "Accenture", id: "accenture", domain: "accenture.com" },
  { name: "Microsoft", id: "microsoft", domain: "microsoft.com" },
  { name: "Infosys", id: "infosys", domain: "infosys.com" },
  { name: "IBM", id: "ibm", domain: "ibm.com" },
  { name: "EY", id: "ey", domain: "ey.com" },
  { name: "PwC", id: "pwc", domain: "pwc.com" },
  { name: "DataFlow", id: "dataflowgroup", domain: "dataflowgroup.com" },
  { name: "HSBC Bank", id: "hsbc", domain: "hsbc.com" },
  { name: "Sarita Handa", id: "saritahanda", domain: "saritahanda.com" },
  { name: "Ratan Textiles", id: "ratantextiles", domain: "ratantextiles.com" },
  { name: "360 One Wealth", id: "360one", domain: "360.one" }
];

const dir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => reject(err));
  });
}

async function main() {
  for (const { id, domain } of domains) {
    const dest = path.join(dir, `${id}.png`);
    try {
      console.log(`Downloading clearbit for ${domain}...`);
      await download(`https://logo.clearbit.com/${domain}`, dest);
    } catch (err) {
      console.log(`Fallback uplead for ${domain}...`);
      try {
        await download(`https://logo.uplead.com/${domain}`, dest);
      } catch(err2) {
        console.log(`Fallback favicon for ${domain}...`);
        try {
          await download(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`, dest);
        } catch(err3) {
          console.error(`Failed completely for ${domain}`);
        }
      }
    }
  }
}

main().then(() => console.log('Done'));
