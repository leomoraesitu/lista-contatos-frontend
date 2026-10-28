import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

function main() {
  if (args.length === 1 && args[0] === '--help') {
    console.log('Uso: node scripts/next-action-prompt.mjs [--stdout]\nSem opções: copia o prompt via pbcopy no macOS. --stdout: imprime sem copiar.');
    return;
  }
  if (args.length > 1 || (args.length === 1 && args[0] !== '--stdout')) {
    throw new Error('Opção inválida. Use --help ou --stdout.');
  }

  const memory = readFileSync(resolve(root, 'MEMORY.md'), 'utf8').replace(/\r\n/g, '\n');
  const action = memory.match(/^## Próxima ação\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1].trim();
  if (!action) {
    throw new Error('MEMORY.md precisa de uma seção "## Próxima ação" com conteúdo.');
  }

  const git = (params) => {
    const result = spawnSync('git', params, { cwd: root, encoding: 'utf8' });
    if (result.error || result.status !== 0) {
      throw new Error(`Falha ao consultar Git: ${result.error?.message || result.stderr.trim()}`);
    }
    return result.stdout.trim();
  };

  const prompt = [
    'Continue o projeto Lista de Contatos usando o contexto abaixo.',
    'Leia AGENTS.md e MEMORY.md no checkout e confirme o estado real antes de agir.',
    'A memória é histórica; preserve alterações locais e siga a solicitação atual do usuário.',
    '',
    '## Checkout no momento da geração',
    `Gerado em: ${new Date().toISOString()}`,
    `Diretório: ${root}`,
    `Branch: ${git(['branch', '--show-current']) || '(HEAD destacado)'}`,
    `Commit: ${git(['log', '-1', '--format=%h %s'])}`,
    'Estado Git (inclui arquivos não rastreados):',
    git(['status', '--short']) || '(sem alterações locais)',
    '',
    '## Ação recomendada pela memória',
    action,
    '',
    '## Contexto completo de MEMORY.md',
    memory.trim(),
    '',
    'Execute a próxima ação somente se ela continuar pendente e corresponder ao pedido atual.',
    'Ao terminar, relate alterações, validações executadas e limitações. Não faça merge automático.',
    '',
  ].join('\n');

  if (args[0] === '--stdout') {
    process.stdout.write(prompt);
    return;
  }
  if (process.platform !== 'darwin') {
    throw new Error('Cópia automática disponível no macOS. Use --stdout nesta plataforma.');
  }
  const copied = spawnSync('/usr/bin/pbcopy', [], { input: prompt, encoding: 'utf8' });
  if (copied.error || copied.status !== 0) {
    throw new Error(`Não foi possível copiar: ${copied.error?.message || copied.stderr.trim() || 'pbcopy falhou'}. Use --stdout como alternativa.`);
  }
  console.log('Prompt gerado a partir de MEMORY.md e copiado para a área de transferência. Cole no chat com ⌘V.');
}

try {
  main();
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
}
