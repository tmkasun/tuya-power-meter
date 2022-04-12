#! /usr/bin/env sh
echo "#### - Starting..."

export ENERGY_API_APP_PORT=8080
export ENERGY_API_APP_ROOT=/home/ubuntu/projects/tuyaMeter/dist/

node ./main.js