const https = require('https');

https.get('https://make-to-be.vercel.app/', (res) => {
  let chunks = [];
  res.on('data', d => chunks.push(d));
  res.on('end', () => {
    let data = Buffer.concat(chunks).toString('utf8');
    const regex = /src=\"(\/assets\/index-[^\"]+\.js)\"/;
    const match = data.match(regex);
    if(match) {
      console.log('Fetching JS:', match[1]);
      https.get('https://make-to-be.vercel.app' + match[1], (jsRes) => {
        let jsChunks = [];
        jsRes.on('data', d => jsChunks.push(d));
        jsRes.on('end', () => {
          let jsData = Buffer.concat(jsChunks).toString('utf8');
          console.log('qawcnogudduhjefsrbxo.supabase.co found?', jsData.includes('qawcnogudduhjefsrbxo.supabase.co'));
          console.log('demoProducts found?', jsData.includes('demoProducts'));
          console.log('JS content length:', jsData.length);
        });
      });
    } else {
        console.log('No JS file found in HTML');
    }
  });
});
