import { spawn, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Executa a API ou seus testes a partir da raiz, sempre dentro da pasta api/.
const pastaApi = fileURLToPath(new URL('../api/', import.meta.url));
const windows = process.platform === 'win32';
const java = process.env.JAVA_HOME
  ? join(process.env.JAVA_HOME, 'bin', windows ? 'java.exe' : 'java')
  : 'java';
const resultadoJava = spawnSync(java, ['-version'], { encoding: 'utf8' });
const versao = /version\s+"(\d+)/.exec(`${resultadoJava.stderr ?? ''} ${resultadoJava.stdout ?? ''}`);

if (resultadoJava.error || resultadoJava.status !== 0 || !versao || Number(versao[1]) < 17) {
  console.error('Instale um JDK 17 ou superior e confira JAVA_HOME antes de executar a API.');
  process.exit(1);
}

const tarefa = process.argv[2] ?? 'run';
if (!['run', 'test'].includes(tarefa)) {
  console.error('Use npm run api para iniciar ou npm run test:api para testar.');
  process.exit(1);
}

const argumentos = ['--batch-mode', '--no-transfer-progress', tarefa === 'test' ? 'test' : 'spring-boot:run'];

// Ajusta a compilação para Java 17 quando o JDK instalado é anterior ao 21.
const versaoJava = Number(versao[1]);
if (versaoJava < 21) argumentos.push('-Djava.version=17');
console.log(`Java ${versaoJava}: ${tarefa === 'test' ? 'testando a API' : 'iniciando a API em http://localhost:8085'}.`);

const processo = windows
  ? spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/c', 'mvnw.cmd', ...argumentos], { cwd: pastaApi, stdio: 'inherit' })
  : spawn('sh', ['./mvnw', ...argumentos], { cwd: pastaApi, stdio: 'inherit' });

processo.on('error', (erro) => {
  console.error(`Não foi possível executar o Maven Wrapper: ${erro.message}`);
  process.exitCode = 1;
});
processo.on('exit', (codigo) => { process.exitCode = codigo ?? 1; });
