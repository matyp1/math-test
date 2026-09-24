import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for (const path of ['index.html','src','data','assets']) await cp(path,`dist/${path}`,{recursive:true});
console.log('Static game built in dist/ (no third-party runtime dependencies).');
