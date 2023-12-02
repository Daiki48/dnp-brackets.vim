import { Denops, helper, fn } from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    "addBrackets": async function(char: string, closeChar: string): Promise<void> {
      await denops.cmd('normal! a' + char + closeChar);
      await denops.cmd('normal! ' + '\\<Left>');
      return "";
    },

    "handleEnterKey": async function(): Promise<string> {
      const line = await fn.line(denops, '.');
      const col = await fn.col(denops, '.');
      const nextChar = (await fn.getline(denops, line)).substring(col, col+1);
      if (nextChar === '}') {
        await denops.cmd('normal! a' + '\\<CR>' + '\\<ESC>' + 'O');
      }
      return '';
    }
  }
  await helper.execute (
    denops,
    `
      inoremap ( <C-r>=denops#request('${denops.name}', 'addBrackets', ['(', ')'])<CR>
      inoremap [ <C-r>=denops#request('${denops.name}', 'addBrackets', ['[', ']'])<CR>
      inoremap { <C-r>=denops#request('${denops.name}', 'addBrackets', ['{', '}'])<CR>
""     inoremap " <C-r>=denops#request('${denops.name}', 'addBrackets', ['"', '"'])<CR>
""     inoremap ' <C-r>=denops#request('${denops.name}', 'addBrackets', ["'", "'"])<CR>
""     inoremap <CR> <C-r>=denops#request('${denops.name}', 'handleEnterKey', [])<CR>
    `
  )
}

