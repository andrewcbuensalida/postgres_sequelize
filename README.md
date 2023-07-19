# Node JS - Postgres & Sequelize

### Postgres & Sequelize playlist:

https://www.youtube.com/playlist?list=PLrwNNiB6YOA04IdB4Oo4faikZ8xzOHj7q

start a postgres instance. Make sure docker desktop is running. --name is container name. -p is port mapping. --rm will delete container when done.
docker run --name postgres-dev -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres

If -p is not specified, the host name/address in pgadmin is the ip address of the container. You can get that with
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' postgres-dev

To show containers
docker ps -a
