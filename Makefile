NOTEBOOKS=boilerplate
SOURCES_ALL=$(NOTEBOOKS:%=src/js/%.js)
DIST_ALL=$(NOTEBOOKS:%=dist/js/%.js)
OBS=env PYTHONPATH=$(realpath deps)/observable-export/src/py:$(PYTHONPATH) $(realpath deps)/observable-export/bin/observable-export

dist: $(DIST_ALL)
	@

.PRECIOUS: %.js

src/js/%.js: .FORCE
	@mkdir -p $(dir $@)
	$(OBS) @sebastien/$* --named -o "$@"


dist/js/%.js: src/js/%.js
	@mkdir -p $(dir $@)
	esbuild --minify --outfile="$@" "$<"

.FORCE:
# EOF
