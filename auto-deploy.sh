#!/bin/sh

git stash
git pull a master  
npm install
pm2 restart all

