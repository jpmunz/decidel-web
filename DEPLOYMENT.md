
```
npm run build
rsync -a build/ <server>:/var/www/<hostname>/html
```


Make sure the server is setup to serve the page as in this sample Nginx config:

```
# /etc/nginx/sites-available/<hostname>
server {                                                                                                                                                                                             [0/567]
    root /var/www/<hostname>/html;
    index index.html index.htm index.nginx-debian.html;

    server_name <hostname> www.<hostname>;

    location / {
        try_files $uri /index.html;
    }

    ...
}
