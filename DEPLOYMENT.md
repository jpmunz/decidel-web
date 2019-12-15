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
```

Actual deployment is handled by the [Deploy Action](.github/workflows/deploy.yml).
