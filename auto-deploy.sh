#!/bin/sh
git pull a master  
npm install
pm2 restart all