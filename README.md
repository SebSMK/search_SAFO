# search_SAFO
JQuery Web interface to [Search SMK's collection homepage][2].
This development is based on Evolvingbweb's [Ajax-Solr JQuery library][1].

#### Application configuration:
`conf/solr_conf.json` contains:
* URI to backend (Solr proxy)
* Solr default parameters 


#### Application sources:
`src/` contains source code to:
* AJAX-solr functions
* Solr Data handling
* Interface widgets
* Interface managers
* Javascript/JQuery extensions


#### Development configuration:
* `test.php` points to all the files stored in `src/`

#### Production configuration:
* `index.php` points to the minified version of the all the files contained in `src/` (see below 'Minifying' section).

*OBS!!! `src/managers/ModelManager.js` is the only file included in `src/` that is not minified and, as a result, used both in Development and Production configuration !!!*

#### Minifying source code for production:
* Minify the source files using the command found in `doc/compiler command`.
* Copy the resulting minified file into `js/`.
* Modify `index.php` in order to point to the new minified file


*For further documentation concerning Ajax-Solr JQuery library (demo, wiki, tuto, code exploration...), please refer to Evolvingweb's [project Github][1]*

[1]: https://github.com/evolvingweb/ajax-solr
[2]: http://collection.smk.dk

