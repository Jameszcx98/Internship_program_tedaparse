#!/bin/sh
git pull origin master  
npm install
pm2 restart webhook.js