// import { exec, ChildProcess } from 'child_process';
import { Watcher } from './Watcher/Watcher.js';
import { DebouncedAccumulator } from './ChangesAccumulator/DebouncedAccumulator.js';

// const prcs: ChildProcess[] = [];

// const execCmd = (params: { cmd: string, name: string }) => {
//    const { cmd, name } = params;
//    console.log(`${name}: started`);
//    const prc = exec(cmd, (error, stdout, stderr) => {
//       if(error) {
//          // console.error(`${name}: error: `, error.message);
//          console.error(`${name}: error: `);
//          console.error(stdout.split('\n').filter(l => l.includes("error"))?.[0]);
//          prcs.filter(p => p !== prc);
//          prcs.forEach(p => { p.kill(); })
//          return;
//       }
//       console.log(`${name}: success`);
//       prcs.filter(p => p !== prc);
//    });
//    prcs.push(prc);
// }

// const serve = () => execCmd({ cmd: 'yarn serve', name: 'serve' });
// const lint = () => execCmd({ cmd: 'yarn eslint --fix src', name: 'eslint' });
// const build = () => execCmd({ cmd: 'yarn tsc && yarn babel dist -d dist', name: 'build' });

const main = () => {
   // serve();
   // watch('./src/**/*.ts', { ignoreInitial: true })
   // .on('error', onError)
   // // @ts-ignore
   // .on('all', (event, filepath) => {
   //    lint();
   //    build();
   // });

   const watcher = new Watcher();
   const accumulator = new DebouncedAccumulator(2_000);
   accumulator.watch({
      watcher,
      globsToWatch: './src/**/*.ts',
      filesChangedCallback(filepaths) {
         console.log(`watchEvent: ${filepaths}`)
      }
   });
}

main();