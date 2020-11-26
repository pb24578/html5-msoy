pm2 delete msoy-client
pm2 delete msoy-server
pm2 start ./deploy-client.sh --name msoy-client
pm2 start ./deploy-server.sh --name msoy-server
