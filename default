server {
    listen 80;
    listen [::]:80;

    root /var/www/tester.kyivtypefoundry.com/build; # make sure this points to your build directory
    index index.html;

    server_name tester.kyivtypefoundry.com;

    location / {
        try_files $uri $uri/ /index.html; # serve index.html for all routes
    }
}