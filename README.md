> It's composed of nodejs express and react.js and mysql

## Config Center

> A project which set, store, manage config for multi-env project.

> You can create app which has a unique name and many configs for different envs

## usage in Docker way

> For safety of configurations, you must provide ipRules in the form of some CIDRs or ipv4 strings splited with ',', it won't work when you access with web.

### run

```bash
docker build . -t ${image}
docker run --name ${container} \
  -e IP_RULES=${ipRules}" \
  -e DB_HOST=${dbHost} \
  -e DB_PORT=${dbPort} \
  -e DB_USER=${dbUser} \
  -e DB_PASSWORD=${dbPassword} \
  -p ${port}:80 \
  -d ${image}
```

### create web admin user

```bash
docker exec -it ${container} sh
node createUser user password
```

### access configuration

```bash
curl http://host/api/core/config.query?app=config-center&env=production
"{"foo": "bar"}"
```

## TODOs

- [ ] auto migrate for mysql(now you should do it manually, files are in `/server-side/migrate`);
- [ ] auto create admin user;
- [ ] Make output part funtional;
- [ ] refactor code;
- [ ] UI&UE optimize;