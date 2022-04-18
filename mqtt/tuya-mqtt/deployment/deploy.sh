
#! /usr/bin/env sh
echo "#### - Deploying..."

echo "#### - Removing 'node_modules' in 'dist'..."

rm -R dist/node_modules/
echo "#### - Coping package*.json to dist to be run in remote node ..."

cp package*.json dist/
cp devices.conf dist/
cp config.json dist/

echo "#### - Creating tmp directory in dist..."

mkdir -p dist/tmp/
touch dist/tmp/knnect.log
echo "#### - Compressing dist..."

tar -cvf tmp/dist.tar.gz dist
echo "#### - Removing remote old files..."

ssh ubuntu@192.168.0.29 'rm -R /home/ubuntu/projects/tuyaMeter/mqtt-monitor/dist*'

echo "#### - Coping compressed file to remote..."

scp -r tmp/dist.tar.gz ubuntu@192.168.0.29:/home/ubuntu/projects/tuyaMeter/mqtt-monitor/

echo "#### - [Remote] extracting compressed file..."

ssh ubuntu@192.168.0.29 'tar -xvf /home/ubuntu/projects/tuyaMeter/mqtt-monitor/dist.tar.gz --directory /home/ubuntu/projects/tuyaMeter/mqtt-monitor/'

echo "#### - [Remote] Installing dependencies ..."
ssh ubuntu@192.168.0.29 'export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.14.2/bin ; npm --prefix /home/ubuntu/projects/tuyaMeter/mqtt-monitor/dist/ ci --production'
echo "#### - [Remote] Changing permissions ..."
ssh ubuntu@192.168.0.29 'chmod 775 /home/ubuntu/projects/tuyaMeter/mqtt-monitor/dist/tuya-mqtt.js'
echo "#### - [Remote] Setting E_APP_ROOT ..."
ssh ubuntu@192.168.0.29 'export E_APP_ROOT=/home/ubuntu/projects/tuyaMeter/dist/'