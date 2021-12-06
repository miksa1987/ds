# DS - Daily Score

Daily Score is a minimal daily score tracker for the hacker
It is designed to reward or punish you for completing actions based on their score, the good(positive) or the bad(negative). You can add/remove actions, do them and list daily scores. Keep your score positive and as high as possible!

### Dependencies
- deno
### Compiling
```sh
deno compile --allow-env --allow-read --allow-write index.ts
```
### Usage
```sh
ds action add name score
ds action remove name
ds action do name

ds score today
ds score date date
```
