
#usage

```
./
+ static
  - js
  - img
  - css
+ public
  - index.html
  + routes
    - about/index.html
```


```
//simple command
$ locally -p 8080

//full command
$ locally --static ./static --public ./public -port 8080

$ curl http://localhost:8080/
$ curl http://localhost:8080/about
```


```python
$ python -m SimpleHTTPServer -p 8080
```


```
$ node lib/locally.js --help

  Usage: locally.js [options] [command]

  Commands:

    init 
    locally setup webserver configuration

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -s, --static <directory>  directory for serving static files
    -d, --public <directory>  directory for serving public files
```

http://localhost:8080/
http://localhost:8080/about/

