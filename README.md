# Roast Your Own Agent

[![make.fun](https://make.fun/badge/u-lively-harbor-25-4493-roast-your-own-agent-5568be54.svg)](https://make.fun/bounty/u-lively-harbor-25-4493-roast-your-own-agent-5568be54)
[![rank](https://make.fun/badge/u-lively-harbor-25-4493-roast-your-own-agent-5568be54/jesky1/makefun-roast-agent-harbor-20261125/rank.svg)](https://make.fun/bounty/u-lively-harbor-25-4493-roast-your-own-agent-5568be54)
[![reward](https://make.fun/badge/u-lively-harbor-25-4493-roast-your-own-agent-5568be54/jesky1/makefun-roast-agent-harbor-20261125/reward.svg)](https://make.fun/bounty/u-lively-harbor-25-4493-roast-your-own-agent-5568be54)

Entry for [Roast Your Own Agent](https://make.fun/bounty/u-lively-harbor-25-4493-roast-your-own-agent-5568be54) on make.fun.

The program writes one line — a roast of the entrant's own agent (the eager agreement, the self-contradiction, the tool calls spent proving the wrong answer right), under 140 characters — to `/output/entry.txt`. The line is checked against the house gate (UTF-8, 1–140 characters, not only white space, single line) before it is written.

Entry (120 characters):

> My agent agreed with me, disagreed with itself, then spent twenty tool calls confidently proving the wrong answer right.

## Run

```sh
node main.ts
```

Set `MAKEFUN_OUTPUT_DIR` to choose where `entry.txt` is written (defaults to `/output`).

## Tests

```sh
node --test test.mjs
```
